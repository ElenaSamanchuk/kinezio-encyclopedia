#!/usr/bin/env node
/**
 * Rebuilds public/figma from the pristine originals in assets-src/figma:
 *   - rasters → WebP (alpha preserved; JPEG-disguised-as-.png converted too)
 *   - SVG     → svgo --precision 4, viewBox kept, IDs not minified
 *
 * Usage:
 *   node scripts/optimize-assets.mjs           # write public/figma
 *   node scripts/optimize-assets.mjs --dry-run # report only
 *   node scripts/optimize-assets.mjs --verbose # also list rejected candidates
 *
 * Why each knob exists
 * --------------------
 * TARGET_WIDTH holds the measured CSS width each image is displayed at, taken
 * from getBoundingClientRect() on the 1440 desktop and 430 mobile artboards.
 * We keep 2x that for retina and never upscale, so an entry only bites when the
 * original actually carries more pixels than any screen can show.
 *
 * WebP is lossy by default. Alpha ramps (phone frame, trainer cut-out, glow,
 * CSS masks) are gated on maxAlpha so a halo cannot slip through. meanRgb is
 * the photographic gate: at the old 6 the picker took the cheapest candidate
 * that cleared it, and theory-b landed at 20.6 dB PSNR — visibly mushy on the
 * faces. 1.6 keeps every photo above ~35 dB for a few tens of KB. If no lossy
 * candidate clears the gate we fall back to lossless WebP.
 *
 * Four files are JPEGs that were saved with a .png extension. They convert to
 * WebP the same way as everything else.
 *
 * SVG IDs are not minified: several files share names like "Vector", and on a
 * Tilda page inlined SVGs would collide if svgo rewrote them all to "a".
 * Unused IDs are stripped; used ones (filter urls in mask-author) keep their
 * original names.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { optimize as svgoOptimize } from "svgo";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "assets-src", "figma");
const OUT_DIR = path.join(ROOT, "public", "figma");
const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");

/** Largest CSS width each image is rendered at, measured in the browser. */
const DISPLAY_WIDTH = {
  "anatomy-shoulder.png": 406,
  "author-alexey-m.png": 285,
  "author-card-left.png": 260,
  "author-card-right.png": 260,
  "author-yuri.png": 271,
  "card-arm.png": 129,
  "certificate-d.png": 499,
  "certificate-m.png": 430,
  "hero-trainer.png": 507,
  "mask-photo1-d.png": 261,
  "mask-photo1-m.png": 185,
  "mask-photo2-d.png": 233,
  "mask-photo2-m.png": 165,
  "phone-frame.png": 737,
  "phone-glow.png": 442,
  "phone-screen.png": 273,
  "photo-trainer-a.png": 261,
  "photo-trainer-b.png": 233,
  "theory-a.png": 406,
  "theory-b.png": 406,
  "video-thumb.png": 512,
};

const DPR = 2;
const MIN_RESIZE_GAIN = 0.05;

/**
 * Ceiling on the error a lossy candidate may introduce, per 8-bit channel.
 * Alpha is held tight: a banded ramp reads as a halo around a cut-out.
 * maxRgb is not gated — WebP routinely hits 255 on a single anti-aliased
 * edge pixel even when meanRgb is ~2. meanRgb is the perceptual driver.
 */
const FIDELITY = { maxAlpha: 16, meanRgb: 1.6 };

const WEBP_QUALITIES = [82, 90, 95, 98];

const ALPHA_ONLY_MASKS = new Set([
  "mask-photo1-d.png",
  "mask-photo1-m.png",
  "mask-photo2-d.png",
  "mask-photo2-m.png",
]);

const SVGO_CONFIG = {
  multipass: true,
  floatPrecision: 4,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // svgo 4 already keeps viewBox; do not minify IDs (Tilda inlining).
          cleanupIds: { minify: false, remove: true },
        },
      },
    },
  ],
};

function webpName(pngName) {
  return pngName.replace(/\.png$/i, ".webp");
}

function pipeline(srcPath, width) {
  return width ? sharp(srcPath).resize({ width, kernel: "lanczos3" }) : sharp(srcPath);
}

async function encodeAlphaOnlyMask(srcPath) {
  const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc((data.length / 4) * 2);
  for (let i = 0, j = 0; i < data.length; i += 4, j += 2) {
    out[j] = 255;
    out[j + 1] = data[i + 3];
  }
  const buf = await sharp(out, { raw: { width: info.width, height: info.height, channels: 2 } })
    .webp({ lossless: true, effort: 6 })
    .toBuffer();

  const back = await sharp(buf).ensureAlpha().raw().toBuffer();
  for (let i = 0; i < data.length; i += 4) {
    if (back[i + 3] !== data[i + 3]) throw new Error(`Alpha changed in ${path.basename(srcPath)}`);
  }
  return { buf, width: info.width };
}

function measure(ref, got) {
  let rgbSum = 0;
  let rgbMax = 0;
  let alphaMax = 0;
  let visible = 0;
  const n = Math.min(ref.length, got.length);
  for (let i = 0; i < n; i += 4) {
    const a = ref[i + 3];
    const da = Math.abs(a - got[i + 3]);
    if (da > alphaMax) alphaMax = da;
    if (a === 0) continue;
    visible++;
    for (let c = 0; c < 3; c++) {
      const d = Math.abs(ref[i + c] - got[i + c]);
      rgbSum += d;
      if (d > rgbMax) rgbMax = d;
    }
  }
  return { meanRgb: visible ? rgbSum / (visible * 3) : 0, maxRgb: rgbMax, maxAlpha: alphaMax };
}

const passes = (m) => m.maxAlpha <= FIDELITY.maxAlpha && m.meanRgb <= FIDELITY.meanRgb;

async function processRaster(name) {
  const srcPath = path.join(SRC_DIR, name);
  const outName = webpName(name);
  const outPath = path.join(OUT_DIR, outName);
  const srcBytes = fs.statSync(srcPath).size;
  const meta = await sharp(srcPath).metadata();

  if (ALPHA_ONLY_MASKS.has(name)) {
    const { buf, width } = await encodeAlphaOnlyMask(srcPath);
    if (!DRY_RUN) fs.writeFileSync(outPath, buf);
    return {
      kind: "raster",
      name: outName,
      srcName: name,
      srcBytes,
      outBytes: buf.length,
      width,
      note: "grey+alpha mask · lossless webp · alpha bit-exact",
      rejected: [],
    };
  }

  const display = DISPLAY_WIDTH[name];
  if (!display) throw new Error(`No measured display width for ${name}`);
  const cap = display * DPR;
  const hasAlpha = meta.hasAlpha === true;

  const widths = [["native", null]];
  if (cap < meta.width * (1 - MIN_RESIZE_GAIN)) widths.push([`${meta.width}\u2192${cap}px`, cap]);

  const candidates = [];
  for (const [widthLabel, width] of widths) {
    const ref = await pipeline(srcPath, width).ensureAlpha().raw().toBuffer();
    for (const q of WEBP_QUALITIES) {
      const buf = await pipeline(srcPath, width)
        .webp({ quality: q, alphaQuality: 100, effort: 4, smartSubsample: true })
        .toBuffer();
      const m = measure(ref, await sharp(buf).ensureAlpha().raw().toBuffer());
      candidates.push({
        label: `q${q}${width ? " · " + widthLabel : ""}`,
        buf,
        width: width || meta.width,
        m,
        ok: passes(m),
      });
    }
    // Soft-alpha glows can compress *smaller* lossless than lossy (phone-glow).
    if (hasAlpha) {
      const lossless = await pipeline(srcPath, width).webp({ lossless: true, effort: 4 }).toBuffer();
      candidates.push({
        label: `lossless${width ? " · " + widthLabel : ""}`,
        buf: lossless,
        width: width || meta.width,
        m: { meanRgb: 0, maxRgb: 0, maxAlpha: 0 },
        ok: true,
      });
    }
  }

  const viable = candidates.filter((c) => c.ok).sort((a, b) => a.buf.length - b.buf.length);
  let best = viable[0];

  /*
   * Полупрозрачный край сам по себе поднимает среднюю ошибку: WebP пишет цвет
   * и под нулевой альфой. У phone-frame даже q98 даёт 1.71 — порог не берёт
   * никто, и остаётся lossless на 494 КБ. Если верхнее лоссу-качество заметно
   * легче, берём его: на глаз неотличимо, вес втрое меньше.
   */
  if (best && best.label.startsWith("lossless")) {
    const topQ = WEBP_QUALITIES[WEBP_QUALITIES.length - 1];
    const lossy = candidates
      .filter((c) => c.label.startsWith(`q${topQ}`))
      .sort((a, b) => a.buf.length - b.buf.length)[0];
    if (lossy && lossy.buf.length < best.buf.length * 0.75) best = lossy;
  }
  const rejected = candidates
    .filter((c) => !c.ok)
    .map((c) => `${c.label} (rgb ${c.m.meanRgb.toFixed(2)}/${c.m.maxRgb}, a ${c.m.maxAlpha})`);

  if (!best) {
    const buf = await sharp(srcPath).webp({ lossless: true, effort: 4 }).toBuffer();
    best = {
      label: "lossless fallback",
      buf,
      width: meta.width,
      m: { meanRgb: 0, maxRgb: 0, maxAlpha: 0 },
    };
  }

  if (!DRY_RUN) fs.writeFileSync(outPath, best.buf);
  return {
    kind: "raster",
    name: outName,
    srcName: name,
    srcBytes,
    outBytes: best.buf.length,
    width: best.width,
    note: `${best.label} · err rgb ${best.m.meanRgb.toFixed(2)}/${best.m.maxRgb} alpha ${best.m.maxAlpha}`,
    rejected,
  };
}

function processSvg(name) {
  const srcPath = path.join(SRC_DIR, name);
  const outPath = path.join(OUT_DIR, name);
  const src = fs.readFileSync(srcPath, "utf8");
  const srcBytes = Buffer.byteLength(src);
  const result = svgoOptimize(src, { path: srcPath, ...SVGO_CONFIG });
  if (result.error) throw new Error(`svgo failed on ${name}: ${result.error}`);

  if (!/viewBox\s*=/.test(result.data)) {
    throw new Error(`svgo dropped viewBox on ${name}`);
  }

  const outBytes = Buffer.byteLength(result.data);
  if (!DRY_RUN) fs.writeFileSync(outPath, result.data);
  return {
    kind: "svg",
    name,
    srcName: name,
    srcBytes,
    outBytes,
    note: outBytes < srcBytes ? "svgo precision 4 · viewBox kept · ids not minified" : "svgo (no smaller, still rewritten)",
  };
}

if (!fs.existsSync(SRC_DIR)) {
  throw new Error(
    `Missing ${SRC_DIR}. The pristine originals live there; they are also in git history at 64f8897.`
  );
}
fs.mkdirSync(OUT_DIR, { recursive: true });

const rasterNames = fs.readdirSync(SRC_DIR).filter((f) => /\.png$/i.test(f)).sort();
const svgNames = fs.readdirSync(SRC_DIR).filter((f) => /\.svg$/i.test(f)).sort();

const results = [];
for (const name of rasterNames) results.push(await processRaster(name));
for (const name of svgNames) results.push(processSvg(name));

if (!DRY_RUN) {
  for (const name of rasterNames) {
    const stale = path.join(OUT_DIR, name);
    if (fs.existsSync(stale)) fs.unlinkSync(stale);
  }
}

const rasters = results.filter((r) => r.kind === "raster");
const svgs = results.filter((r) => r.kind === "svg");
const fmt = (n) => (n >= 1024 ? `${(n / 1024).toFixed(n >= 100 * 1024 ? 0 : 1)}K` : `${n}B`);

function printGroup(title, rows, srcTotal, outTotal) {
  console.log(`\n${DRY_RUN ? "[dry run] " : ""}${title}`);
  console.log("file".padEnd(24) + "before".padStart(9) + "after".padStart(9) + "  saved  detail");
  for (const r of rows.sort((a, b) => b.srcBytes - a.srcBytes)) {
    const saved = r.srcBytes ? (1 - r.outBytes / r.srcBytes) * 100 : 0;
    console.log(
      (r.srcName || r.name).padEnd(24) +
        fmt(r.srcBytes).padStart(9) +
        fmt(r.outBytes).padStart(9) +
        `${saved.toFixed(0)}%`.padStart(7) +
        "  " +
        r.note
    );
    if (VERBOSE) {
      for (const rej of r.rejected || []) console.log(" ".repeat(24) + "rejected: " + rej);
    }
  }
  console.log(
    `${fmt(srcTotal)} → ${fmt(outTotal)} ` +
      `(-${((1 - outTotal / srcTotal) * 100) | 0}%, ${fmt(srcTotal - outTotal)} saved)`
  );
}

const rSrc = rasters.reduce((n, r) => n + r.srcBytes, 0);
const rOut = rasters.reduce((n, r) => n + r.outBytes, 0);
const sSrc = svgs.reduce((n, r) => n + r.srcBytes, 0);
const sOut = svgs.reduce((n, r) => n + r.outBytes, 0);

printGroup("SVG  assets-src/figma → public/figma", svgs, sSrc, sOut);
printGroup("WebP assets-src/figma → public/figma", rasters, rSrc, rOut);
console.log(
  `\npublic/figma written. Raster originals stay in assets-src/figma (png); ` +
    `SVG originals stay there too.`
);
