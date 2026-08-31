#!/usr/bin/env node
/**
 * Builds tilda-encyclopedia.html — a single self-contained snippet for a Tilda
 * T123 «HTML-код» block.
 *
 * Usage:
 *   npm run build            # produce out/ via next export
 *   node scripts/build-tilda.mjs
 *
 * The snippet is derived from the static export, so the Tilda page and the
 * Next app never drift apart. Three things are rewritten on the way out:
 *   - every selector is scoped to #kin-wrap, because Tilda injects the code
 *     into its own document and Tailwind's preflight would reset the whole page;
 *   - images and fonts point at a CDN copy of public/ instead of local paths;
 *   - React is replaced by a few lines of vanilla JS for the canvas zoom,
 *     the FAQ accordion and the countdown.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "out");
const PUBLIC_DIR = path.join(ROOT, "public");
const FONT_DIR = path.join(PUBLIC_DIR, "fonts");
const OUT_FILE = path.join(ROOT, "tilda-encyclopedia.html");

const WRAP = "#kin-wrap";
const GITHUB_REPO = process.env.KIN_REPO || "ElenaSamanchuk/kinezio-encyclopedia";
const GITHUB_REF = process.env.KIN_REF || "main";
const ASSET_BASE =
  process.env.KIN_ASSET_BASE ||
  `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@${GITHUB_REF}/public/`;

/** Google splits each family into subsets; the landing only needs these two. */
const KEEP_SUBSETS = [/u\+0400-045f/i, /u\+00\?\?/i];

/* ------------------------------------------------------------------ CSS --- */

/** Splits `a{...}` style blocks, honouring nesting and comments. */
function blockEnd(css, braceIdx) {
  let depth = 0;
  for (let i = braceIdx; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return css.length;
}

function scopeSelector(sel) {
  sel = sel.trim();
  if (!sel) return sel;
  if (sel === ":root" || sel === ":host" || sel === "html" || sel === "body") return WRAP;
  if (sel.startsWith("*")) return `${WRAP} ${sel}`;
  if (sel.startsWith("::")) return `${WRAP} *${sel}`;
  if (/^html\b/.test(sel)) return WRAP + sel.slice(4);
  if (/^body\b/.test(sel)) return WRAP + sel.slice(4);
  if (sel.startsWith(WRAP)) return sel;
  return `${WRAP} ${sel}`;
}

function scopeSelectors(list) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const ch of list) {
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts.map(scopeSelector).filter(Boolean).join(",");
}

/**
 * Scopes every rule to the wrapper and flattens `@layer` blocks: Tilda's own
 * stylesheet is unlayered, and unlayered rules always beat layered ones no
 * matter the specificity.
 */
function scopeCss(css) {
  let out = "";
  let i = 0;

  while (i < css.length) {
    if (css.slice(i, i + 2) === "/*") {
      const end = css.indexOf("*/", i + 2);
      i = end === -1 ? css.length : end + 2;
      continue;
    }

    const ws = css.slice(i).match(/^\s+/);
    if (ws) {
      out += " ";
      i += ws[0].length;
      continue;
    }

    if (css[i] === "@") {
      const semi = css.indexOf(";", i);
      const brace = css.indexOf("{", i);
      if (brace === -1 || (semi !== -1 && semi < brace)) {
        // Statement at-rule such as `@layer theme,base;` — carries no styles.
        i = semi === -1 ? css.length : semi + 1;
        continue;
      }
      const rule = css.slice(i, brace).trim();
      const end = blockEnd(css, brace);
      const body = css.slice(brace + 1, end - 1);

      if (/^@layer\b/.test(rule)) out += scopeCss(body);
      else if (/^@(media|supports|container)\b/.test(rule)) out += `${rule}{${scopeCss(body)}}`;
      else out += css.slice(i, end);

      i = end;
      continue;
    }

    const brace = css.indexOf("{", i);
    if (brace === -1) break;
    const end = blockEnd(css, brace);
    out += `${scopeSelectors(css.slice(i, brace))}{${css.slice(brace + 1, end - 1).trim()}}`;
    i = end;
  }

  return out;
}

function minifyCss(css) {
  return css
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Keeps the latin + cyrillic faces and returns the woff2 files they need. */
function pickFontFaces(css) {
  const faces = [];
  const files = new Set();
  const re = /@font-face\{[^}]*\}/g;
  let match;
  while ((match = re.exec(css))) {
    const face = match[0];
    const range = face.match(/unicode-range:([^;}]*)/);
    if (range && !KEEP_SUBSETS.some((re2) => re2.test(range[1]))) continue;
    const url = face.match(/url\(([^)]+)\)/);
    if (url) files.add(path.basename(url[1]));
    faces.push(face);
  }
  return { faces, files };
}

/* ----------------------------------------------------------------- HTML --- */

function readExport() {
  const html = fs.readFileSync(path.join(OUT_DIR, "index.html"), "utf8");
  const cssDir = path.join(OUT_DIR, "_next", "static", "css");
  const cssFile = fs.readdirSync(cssDir).find((f) => f.endsWith(".css"));
  if (!cssFile) throw new Error("No compiled CSS in out/_next/static/css");
  return { html, css: fs.readFileSync(path.join(cssDir, cssFile), "utf8") };
}

function extractMarkup(html) {
  const main = html.match(/<main[\s\S]*<\/main>/);
  if (!main) throw new Error("No <main> in the export — did `next build` run?");
  const bodyClass = html.match(/<body class="([^"]*)"/);
  return {
    markup: main[0].replace(/<!--(?:\$|\/\$|[^>]*?)-->/g, ""),
    fontClass: bodyClass ? bodyClass[1] : "",
  };
}

function toCdn(text) {
  return text
    .replace(/(["'(])\/figma\//g, `$1${ASSET_BASE}figma/`)
    .replace(/(["'(])\/_next\/static\/media\//g, `$1${ASSET_BASE}fonts/`);
}

function copyFonts(files) {
  fs.rmSync(FONT_DIR, { recursive: true, force: true });
  fs.mkdirSync(FONT_DIR, { recursive: true });
  const mediaDir = path.join(OUT_DIR, "_next", "static", "media");
  for (const file of files) {
    fs.copyFileSync(path.join(mediaDir, file), path.join(FONT_DIR, file));
  }
}

/* ------------------------------------------------------------------- JS --- */

const RUNTIME = `(function(){
  var wrap=document.getElementById('kin-wrap');
  if(!wrap||wrap.dataset.kinReady)return;
  wrap.dataset.kinReady='1';

  /* Fixed-width artboards (1440 / 430) zoom down to the block width. */
  var canvases=[].slice.call(wrap.querySelectorAll('[data-kin-canvas]'));
  function fit(){
    var available=wrap.clientWidth||document.documentElement.clientWidth;
    canvases.forEach(function(el){
      var w=parseInt(el.getAttribute('data-kin-canvas'),10);
      el.style.zoom=available>=w?'1':String(available/w);
    });
  }
  fit();
  window.addEventListener('resize',fit);
  window.addEventListener('load',fit);
  if(window.ResizeObserver)new ResizeObserver(fit).observe(wrap);

  /* FAQ: one open item per column. */
  wrap.addEventListener('click',function(e){
    var button=e.target.closest&&e.target.closest('[data-kin-faq-item] button');
    if(!button)return;
    var item=button.closest('[data-kin-faq-item]');
    var open=item.getAttribute('data-kin-open')!=='true';
    [].forEach.call(item.parentNode.children,function(sibling){
      if(!sibling.hasAttribute('data-kin-faq-item'))return;
      sibling.setAttribute('data-kin-open','false');
      var b=sibling.querySelector('button');
      if(b)b.setAttribute('aria-expanded','false');
    });
    item.setAttribute('data-kin-open',String(open));
    button.setAttribute('aria-expanded',String(open));
  });

  /* Countdown to the end of the sale. */
  var timers=[].slice.call(wrap.querySelectorAll('[data-kin-countdown]'));
  if(timers.length){
    var pad=function(n){return n<10?'0'+n:String(n)};
    var tick=function(){
      timers.forEach(function(timer){
        var left=Math.max(0,Math.floor((+timer.getAttribute('data-kin-countdown')-Date.now())/1000));
        var parts=[Math.floor(left/86400),Math.floor(left%86400/3600),Math.floor(left%3600/60),left%60];
        parts.forEach(function(value,i){
          var slot=timer.querySelector('[data-kin-countdown-value="'+i+'"]');
          if(slot)slot.textContent=pad(value);
        });
      });
    };
    tick();
    setInterval(tick,1000);
  }
})();`;

/* ---------------------------------------------------------------- build --- */

function build() {
  const { html, css } = readExport();
  const { markup, fontClass } = extractMarkup(html);

  const { faces, files } = pickFontFaces(css);
  copyFonts(files);

  const rules = css.replace(/@font-face\{[^}]*\}/g, "");
  const scoped = minifyCss(scopeCss(rules));
  const reset = `${WRAP}{box-sizing:border-box;display:block;width:100%;max-width:100%;text-align:left}`;
  const finalCss = toCdn(minifyCss(faces.join("")) + reset + scoped);

  const output = `<meta charset="UTF-8">
<!-- Энциклопедия тренера · блок T123 · сборка ${new Date().toISOString().slice(0, 10)} · ассеты: ${ASSET_BASE} -->
<style>${finalCss}</style>
<div id="kin-wrap"><div class="${fontClass}">${toCdn(markup)}</div></div>
<script>${RUNTIME}</script>
`;

  fs.writeFileSync(OUT_FILE, output, "utf8");

  const checks = {
    scopedCss: finalCss.includes(`${WRAP} .`),
    noGlobalReset: !/(^|[};])(html|body|\*)\{/.test(finalCss),
    noLayers: !finalCss.includes("@layer"),
    cdnImages: output.includes(`${ASSET_BASE}figma/`),
    cdnFonts: output.includes(`${ASSET_BASE}fonts/`),
    noNextScripts: !output.includes("/_next/static/chunks"),
    desktop: output.includes('data-kin-canvas="1440"'),
    mobile: output.includes('data-kin-canvas="430"'),
    faq: output.includes("data-kin-faq-item"),
    countdown: output.includes("data-kin-countdown"),
  };

  const failed = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([name]) => name);

  const size = fs.statSync(OUT_FILE).size;
  console.log(`Wrote ${OUT_FILE}`);
  console.log(`  ${(size / 1024).toFixed(1)} KB · ${faces.length} font faces · ${files.size} woff2`);
  console.log(`  assets: ${ASSET_BASE}`);
  if (failed.length) throw new Error(`Checks failed: ${failed.join(", ")}`);
  if (size > 200 * 1024) console.warn("  Warning: heavy for the Tilda editor (>200 KB)");
}

build();
