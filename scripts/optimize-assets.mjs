#!/usr/bin/env node
/**
 * Re-encodes the raster assets in public/figma from the pristine originals in
 * assets-src/figma, in place and under the same filenames, so nothing else in
 * the repo (src/lib/assets.ts, the Tilda build, the jsDelivr URLs) has to change.
 *
 * The originals live outside public/ on purpose: anything under public/ is
 * copied into the static export and published to the CDN, and shipping a second
 * 7.9 MB copy that nothing references would defeat the point of the exercise.
 * They are also recoverable from git history at commit 64f8897.
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
 * Encoding is chosen per file instead of globally, because these assets are not
 * homogeneous:
 *   - Opaque photographs quantise to a 256-colour palette almost for free
 *     (mean error well under one 8-bit step) and shrink by ~70%.
 *   - Anything with a soft alpha gradient — the masks, the phone frame, the
 *     cut-out trainer, the glow — must NOT be palettised: a PNG palette has to
 *     spend its 256 entries on colour *and* alpha, which visibly banded the
 *     alpha ramp in testing (max alpha error up to 197/255). Those files get a
 *     lossless re-encode with adaptive filtering instead.
 * Every candidate is measured against the exact reference pixels and the result
 * is gated on FIDELITY below, so a bad trade cannot slip through silently.
 *
 * Four files are JPEGs that were saved with a .png extension (browsers sniff the
 * content, so they render fine). They are already efficiently compressed and
 * re-encoding would only add generation loss, so they are copied verbatim.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "assets-src", "figma");
const OUT_DIR = path.join(ROOT, "public", "figma");
const DRY_RUN = process.argv.includes("--dry-run");

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

/** Retina factor, and the minimum saving that justifies resampling at all. */
const DPR = 2;
const MIN_RESIZE_GAIN = 0.05;

/**
 * Ceiling on the error a lossy candidate may introduce, per 8-bit channel.
 * meanRgb is the perceptual driver; maxRgb/maxAlpha are single-pixel outliers
 * that in practice sit on anti-aliased edges, so they get more headroom. Alpha
 * is still held tight: a banded alpha ramp reads as a halo around a cut-out,
 * which is far more visible than a slightly shifted colour.
 */
const FIDELITY = { maxAlpha: 24, meanRgb: 2.2, maxRgb: 120 };

const LOSSLESS = { palette: false, compressionLevel: 9, adaptiveFiltering: true };
const PALETTE = { palette: true, colours: 256, dither: 1.0, quality: 100, effort: 10 };

/**
 * Files consumed only as CSS `mask-image` with `mask-mode: alpha`
 * (see src/components/ui/MaskedPhoto.tsx). Their colour channels are never
 * sampled, and Figma left uncorrelated photo data in them, which is pure
 * compressed weight. We rewrite them as grey+alpha with grey pinned to white
 * and the alpha channel copied bit-for-bit: identical under `alpha` masking,
 * and also correct if a browser ever fell back to `luminance` masking, since
 * white luminance means "fully visible" and the alpha ramp still applies.
 */
const ALPHA_ONLY_MASKS = new Set([
  "mask-photo1-d.png",
  "mask-photo1-m.png",
  "mask-photo2-d.png",
  "mask-photo2-m.png",
]);

async function encodeAlphaOnlyMask(srcPath) {
  const { data, info } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc((data.length / 4) * 2);
  for (let i = 0, j = 0; i < data.length; i += 4, j += 2) {
    out[j] = 255;
    out[j + 1] = data[i + 3];
  }
  const buf = await sharp(out, { raw: { width: info.width, height: info.height, channels: 2 } })
    .png(LOSSLESS)
    .toBuffer();

  // The alpha ramp is the entire payload here, so assert it survived exactly.
  const back = await sharp(buf).ensureAlpha().raw().toBuffer();
  for (let i = 0; i < data.length; i += 4) {
    if (back[i + 3] !== data[i + 3]) throw new Error(`Alpha changed in ${path.basename(srcPath)}`);
  }
  return { buf, width: info.width };
}

/** Alpha-weighted RGB error plus raw alpha error, both vs the reference pixels. */
function measure(ref, got) {
  let rgbSum = 0;
  let rgbMax = 0;
  let alphaMax = 0;
  let visible = 0;
  for (let i = 0; i < ref.length; i += 4) {
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

const passes = (m) =>
  m.maxAlpha <= FIDELITY.maxAlpha && m.meanRgb <= FIDELITY.meanRgb && m.maxRgb <= FIDELITY.maxRgb;

async function processFile(name) {
  const srcPath = path.join(SRC_DIR, name);
  const outPath = path.join(OUT_DIR, name);
  const srcBytes = fs.statSync(srcPath).size;
  const meta = await sharp(srcPath).metadata();

  // JPEG payloads wearing a .png name: already compact, copying avoids re-loss.
  if (meta.format !== "png") {
    if (!DRY_RUN) fs.copyFileSync(srcPath, outPath);
    return { name, srcBytes, outBytes: srcBytes, note: `copied as-is (${meta.format})`, width: meta.width };
  }

  if (ALPHA_ONLY_MASKS.has(name)) {
    const { buf, width } = await encodeAlphaOnlyMask(srcPath);
    if (!DRY_RUN) fs.writeFileSync(outPath, buf);
    return {
      name,
      srcBytes,
      outBytes: buf.length,
      width,
      note: "grey+alpha mask · alpha bit-exact",
      rejected: [],
    };
  }

  const display = DISPLAY_WIDTH[name];
  if (!display) throw new Error(`No measured display width for ${name}`);
  const cap = display * DPR;

  /*
   * Both widths are tried, not just the capped one: resampling a smooth
   * gradient invents intermediate values and can compress *worse* than the
   * original (phone-glow went 116K -> 339K when downscaled, but 116K -> 52K
   * at its native size). Cheaper to measure both than to reason about it.
   */
  const widths = [["native", null]];
  if (cap < meta.width * (1 - MIN_RESIZE_GAIN)) widths.push([`${meta.width}\u2192${cap}px`, cap]);

  const candidates = [];
  for (const [widthLabel, width] of widths) {
    const pipeline = () =>
      width ? sharp(srcPath).resize({ width, kernel: "lanczos3" }) : sharp(srcPath);
    const ref = await pipeline().ensureAlpha().raw().toBuffer();

    for (const [encLabel, opts] of [["lossless", LOSSLESS], ["palette", PALETTE]]) {
      const buf = await pipeline().png(opts).toBuffer();
      const m =
        encLabel === "lossless"
          ? { meanRgb: 0, maxRgb: 0, maxAlpha: 0 }
          : measure(ref, await sharp(buf).ensureAlpha().raw().toBuffer());
      candidates.push({
        label: `${encLabel}${width ? " · " + widthLabel : ""}`,
        enc: encLabel,
        buf,
        width: width || meta.width,
        m,
        ok: passes(m),
      });
    }
  }

  // Smallest candidate that clears the fidelity gate, and that actually helps.
  const viable = candidates.filter((c) => c.ok).sort((a, b) => a.buf.length - b.buf.length);
  const best = viable[0];
  const rejected = candidates
    .filter((c) => !c.ok)
    .map((c) => `${c.label} (rgb ${c.m.meanRgb.toFixed(2)}/${c.m.maxRgb}, a ${c.m.maxAlpha})`);

  if (!best || best.buf.length >= srcBytes) {
    if (!DRY_RUN) fs.copyFileSync(srcPath, outPath);
    return {
      name,
      srcBytes,
      outBytes: srcBytes,
      width: meta.width,
      note: "kept original (no candidate was both faithful and smaller)",
      rejected,
    };
  }

  if (!DRY_RUN) fs.writeFileSync(outPath, best.buf);
  return {
    name,
    srcBytes,
    outBytes: best.buf.length,
    width: best.width,
    note:
      best.label +
      (best.enc === "palette"
        ? ` · err rgb ${best.m.meanRgb.toFixed(2)}/${best.m.maxRgb} alpha ${best.m.maxAlpha}`
        : ""),
    rejected,
  };
}

if (!fs.existsSync(SRC_DIR)) {
  throw new Error(
    `Missing ${SRC_DIR}. The pristine originals live there; they are also in git history at 64f8897.`
  );
}
fs.mkdirSync(OUT_DIR, { recursive: true });

const names = fs.readdirSync(SRC_DIR).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();
const results = [];
for (const name of names) results.push(await processFile(name));

const totalSrc = results.reduce((n, r) => n + r.srcBytes, 0);
const totalOut = results.reduce((n, r) => n + r.outBytes, 0);

console.log(`${DRY_RUN ? "[dry run] " : ""}assets-src/figma -> public/figma\n`);
console.log("file".padEnd(22) + "before".padStart(9) + "after".padStart(9) + "  saved  detail");
for (const r of results.sort((a, b) => b.srcBytes - a.srcBytes)) {
  const saved = r.srcBytes ? (1 - r.outBytes / r.srcBytes) * 100 : 0;
  console.log(
    r.name.replace(".png", "").padEnd(22) +
      `${(r.srcBytes / 1024).toFixed(0)}K`.padStart(9) +
      `${(r.outBytes / 1024).toFixed(0)}K`.padStart(9) +
      `${saved.toFixed(0)}%`.padStart(7) +
      "  " + r.note
  );
  if (process.argv.includes("--verbose")) {
    for (const rej of r.rejected || []) console.log(" ".repeat(24) + "rejected: " + rej);
  }
}
console.log(
  `\n${(totalSrc / 1024).toFixed(0)} KB -> ${(totalOut / 1024).toFixed(0)} KB ` +
    `(-${(1 - totalOut / totalSrc) * 100 | 0}%, ${((totalSrc - totalOut) / 1024).toFixed(0)} KB saved)`
);
