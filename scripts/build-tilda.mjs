#!/usr/bin/env node
/**
 * Builds the Tilda «HTML-код» (T123) snippets from the static Next export.
 *
 * Outputs, all minified, each pasteable block aimed under ~40 KB (hard cap 45 KB):
 *   tilda-1-css.html           — styles, paste first;
 *   tilda-2a-html.html         — desktop 1440 canvas, paste second;
 *   tilda-2b-html.html         — mobile 430 canvas, paste third;
 *   tilda-3-js.html            — zoom / FAQ / countdown, paste fourth;
 *   tilda-encyclopedia.html    — the same thing in one block (local preview);
 *   tilda-external.html        — tiny CSS+JS <link>/<script> (jsDelivr; 404 until
 *                                public/tilda/kin.{css,js} is on GitHub);
 *   public/tilda/kin.{css,js}  — what tilda-external.html points at.
 *
 * Tilda puts every T123 in its own `.t-rec`, so one `#kin-wrap` cannot wrap
 * later blocks. CSS is scoped to `.kin-root` on each fragment instead.
 *
 * Usage:
 *   npm run build            # produce out/ via next export
 *   node scripts/build-tilda.mjs
 *
 * The snippet is derived from the static export, so the Tilda page and the
 * Next app never drift apart. Three things are rewritten on the way out:
 *   - every selector is scoped to .kin-root, because Tilda injects the code
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
const CSS_FILE = path.join(ROOT, "tilda-1-css.html");
const HTML_DESKTOP_FILE = path.join(ROOT, "tilda-2a-html.html");
const HTML_MOBILE_FILE = path.join(ROOT, "tilda-2b-html.html");
const LEGACY_HTML_FILE = path.join(ROOT, "tilda-2-html.html");
const JS_FILE = path.join(ROOT, "tilda-3-js.html");
const EXTERNAL_FILE = path.join(ROOT, "tilda-external.html");
const TILDA_ASSET_DIR = path.join(PUBLIC_DIR, "tilda");
const PASTE_LIMIT = 50 * 1024;

const WRAP = ".kin-root";
const GITHUB_REPO = process.env.KIN_REPO || "ElenaSamanchuk/kinezio-encyclopedia";
const GITHUB_REF = process.env.KIN_REF || "main";
const ASSET_BASE =
  process.env.KIN_ASSET_BASE ||
  `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@${GITHUB_REF}/public/`;

/** Google splits each family into subsets; the landing only needs latin + cyrillic. */
const KEEP_SUBSETS = [/u\+0400-045f/i, /u\+00\?\?/i];
/** Weights actually used after dropping the header/logo (no Geist). */
const KEEP_FONTS = {
  Manrope: new Set(["500", "600", "700", "800"]),
};
const SALE_END_MS = Date.parse("2026-09-03T23:59:59+03:00");
const CHECKOUT_FULL = "https://lk.kineziofitness.online/payments/tariff_nwn1gA/checkout";
const SUPPORT_TG = "tg://resolve?domain=KINEZIOFITNESSCARE";
const HERO_IMG = "figma/hero-trainer.webp";

/**
 * The display face from the design, served from the repo copy in public/type.
 * It is authored by hand in globals.css rather than next/font, so it never
 * appears in the hashed media folder and must be injected here verbatim.
 * `/type/…` is rewritten onto the CDN by toCdn() with the rest of the assets.
 */
const DISPLAY_FAMILY = "Murs Gothic Wide Dark";
const DISPLAY_FACE =
  `@font-face{font-family:"${DISPLAY_FAMILY}";font-style:normal;font-weight:100 900;` +
  `font-display:swap;src:url(/type/murs-gothic-wide-dark.woff2) format("woff2"),` +
  `url(/type/murs-gothic-wide-dark.ttf) format("truetype")}`;
const DISPLAY_FONT_URL = "/type/murs-gothic-wide-dark.woff2";

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

/**
 * Classes Next puts on <body> — the font variables live there. They move onto
 * the wrapper itself, so their rules must attach to it instead of nesting under
 * it, or `font-family: var(--font-manrope)` on the wrapper resolves to nothing.
 */
let wrapClasses = new Set();

function scopeSelector(sel) {
  sel = sel.trim();
  if (!sel) return sel;
  if (sel === ":root" || sel === ":host" || sel === "html" || sel === "body") return WRAP;
  const bare = sel.match(/^\.([\w-]+)$/);
  if (bare && wrapClasses.has(bare[1])) return `${WRAP}${sel},${WRAP} ${sel}`;
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

/** Placeholder marker for spans that must survive whitespace collapsing. */
const VAULT = "\u0001";

/**
 * Pulls quoted strings, `url(...)` and `calc(...)` out of the way so that the
 * whitespace pass below cannot corrupt them — inside `calc()` the spaces
 * around `+`/`-` are load-bearing.
 */
function vaultSpans(css) {
  const spans = [];
  let out = "";
  let i = 0;

  const stash = (text) => {
    out += `${VAULT}${spans.push(text) - 1}${VAULT}`;
  };

  while (i < css.length) {
    const ch = css[i];

    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < css.length && css[j] !== ch) j += css[j] === "\\" ? 2 : 1;
      j = Math.min(j + 1, css.length);
      stash(css.slice(i, j));
      i = j;
      continue;
    }

    const fn = /^(url|calc)\(/i.exec(css.slice(i, i + 6));
    if (fn) {
      let depth = 0;
      let j = css.indexOf("(", i);
      for (; j < css.length; j++) {
        if (css[j] === "(") depth++;
        else if (css[j] === ")" && --depth === 0) {
          j++;
          break;
        }
      }
      // An unquoted url() may legitimately contain spaces, so only trim.
      const raw = css.slice(i, j);
      stash(
        fn[1].toLowerCase() === "url"
          ? raw.replace(/^url\(\s*/i, "url(").replace(/\s*\)$/, ")")
          : raw.replace(/\s+/g, " ")
      );
      i = j;
      continue;
    }

    out += ch;
    i++;
  }

  return { text: out, spans };
}

function splitTopLevel(list, separator) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const ch of list) {
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    if (ch === separator && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts;
}

/** `:root,html,body` all scope to `.kin-root`, so lists come out duplicated. */
function dedupeSelectorList(prelude) {
  if (!prelude || prelude.startsWith("@") || !prelude.includes(",")) return prelude;
  return [...new Set(splitTopLevel(prelude, ","))].join(",");
}

const AT_RULES_WITH_RULES = /^@(media|supports|container|layer|scope|keyframes|document)\b/i;
/** In a selector, a space before `:` or `(` is meaningful (`a :hover`, `and (`). */
const DROP_IN_DECL = new Set(["{", "}", ":", ";", ",", "!"]);
const DROP_IN_SELECTOR = new Set(["{", "}", ",", ">", "~", "+"]);

/**
 * Collapses whitespace without touching anything where it carries meaning, and
 * drops the leftovers a hand-written stylesheet never has but a compiler does:
 * trailing semicolons, empty rules, duplicated selectors, leading `0` in `0.5`.
 */
function minifyCss(css) {
  const { text, spans } = vaultSpans(css);
  const stack = [];
  let out = "";
  let preludeStart = 0;
  let i = 0;

  const inDecls = () => stack[stack.length - 1] === "decls";

  while (i < text.length) {
    const ch = text[i];

    if (/\s/.test(ch)) {
      let j = i;
      while (j < text.length && /\s/.test(text[j])) j++;
      const prev = out[out.length - 1];
      const next = text[j];
      const drop = inDecls() ? DROP_IN_DECL : DROP_IN_SELECTOR;
      if (next !== undefined && prev !== undefined && !drop.has(prev) && !drop.has(next)) {
        out += " ";
      }
      i = j;
      continue;
    }

    if (ch === "{") {
      const prelude = out.slice(preludeStart);
      stack.push(AT_RULES_WITH_RULES.test(prelude) ? "rules" : "decls");
      out = out.slice(0, preludeStart) + dedupeSelectorList(prelude) + "{";
      preludeStart = out.length;
      i++;
      continue;
    }

    if (ch === "}") {
      stack.pop();
      if (out[out.length - 1] === ";") out = out.slice(0, -1);
      if (out.endsWith("{")) {
        // Empty rule — drop it together with its prelude.
        const openIdx = out.lastIndexOf("{");
        const cut = Math.max(out.lastIndexOf("}", openIdx), out.lastIndexOf(";", openIdx)) + 1;
        out = out.slice(0, cut);
      } else {
        out += "}";
      }
      preludeStart = out.length;
      i++;
      continue;
    }

    if (ch === ";") {
      if (out[out.length - 1] !== ";") out += ";";
      preludeStart = out.length;
      i++;
      continue;
    }

    out += ch;
    i++;
  }

  out = out.replace(/([\s:,(+\-*/])0\.(\d)/g, "$1.$2");
  return out.replace(new RegExp(`${VAULT}(\\d+)${VAULT}`, "g"), (_, n) => spans[+n]).trim();
}

/** Keeps the latin + cyrillic faces at the weights we actually use. */
function pickFontFaces(css) {
  const faces = [];
  const files = new Set();
  const re = /@font-face\{[^}]*\}/g;
  let match;
  while ((match = re.exec(css))) {
    const face = match[0];
    const familyRaw = face.match(/font-family:([^;]+)/);
    const weightRaw = face.match(/font-weight:([^;]+)/);
    if (!familyRaw || !weightRaw) continue;
    const family = familyRaw[1].replace(/['"]/g, "").trim();
    const weight = weightRaw[1].trim();
    const allowed = KEEP_FONTS[family];
    if (!allowed || !allowed.has(weight)) continue;
    const range = face.match(/unicode-range:([^;}]*)/);
    if (range && !KEEP_SUBSETS.some((re2) => re2.test(range[1]))) continue;
    const url = face.match(/url\(([^)]+)\)/);
    if (url) files.add(path.basename(url[1].replace(/['"]/g, "")));
    faces.push(face);
  }
  return { faces, files };
}

/** Manrope faces from next/font, plus the hand-authored display face. */
function withDisplayFace(faces) {
  return faces.concat(DISPLAY_FACE);
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

function nextTag(html, i) {
  const start = html.indexOf("<", i);
  if (start === -1) return null;
  let quote = "";
  for (let j = start + 1; j < html.length; j++) {
    const ch = html[j];
    if (quote) {
      if (ch === quote) quote = "";
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === ">") return { start, end: j + 1, text: html.slice(start, j + 1) };
  }
  return { start, end: html.length, text: html.slice(start) };
}

/** Splits a string of sibling elements into top-level tags (div-aware). */
function splitTopLevelDivs(html) {
  const parts = [];
  let i = 0;
  while (i < html.length) {
    const tag = nextTag(html, i);
    if (!tag) break;
    if (!/^<div\b/i.test(tag.text)) {
      i = tag.end;
      continue;
    }
    const start = tag.start;
    if (/\/>$/.test(tag.text)) {
      parts.push(html.slice(start, tag.end));
      i = tag.end;
      continue;
    }
    let depth = 1;
    i = tag.end;
    while (i < html.length && depth > 0) {
      const t = nextTag(html, i);
      if (!t) break;
      i = t.end;
      if (/^<\/div\b/i.test(t.text)) depth--;
      else if (/^<div\b/i.test(t.text) && !/\/>$/.test(t.text)) depth++;
    }
    parts.push(html.slice(start, i));
  }
  return parts;
}

/**
 * Pulls the two artboard wrappers out of `<main>` so each T123 can carry its
 * own `.kin-root`. The `hidden lg:block` / `lg:hidden` shells are dropped:
 * visibility is driven by `[data-kin-artboard]` so a hidden canvas cannot
 * leave a `min-h-screen` hole in a neighbouring Tilda record.
 */
function splitArtboards(markup) {
  const open = markup.match(/^<main\b[^>]*>/);
  if (!open) throw new Error("No <main> wrapper to split");
  const inner = markup.slice(open[0].length, markup.lastIndexOf("</main>"));
  const children = splitTopLevelDivs(inner);
  const desktop = children.find((el) => el.includes('data-kin-canvas="1440"'));
  const mobile = children.find((el) => el.includes('data-kin-canvas="430"'));
  if (!desktop || !mobile) {
    throw new Error(`Could not split artboards (found ${children.length} top-level divs)`);
  }
  return { desktop: unwrapVisibilityShell(desktop), mobile: unwrapVisibilityShell(mobile) };
}

function unwrapVisibilityShell(el) {
  if (!/^<div\b/i.test(el) || !el.endsWith("</div>")) return el;
  const gt = el.indexOf(">");
  if (gt === -1) return el;
  const open = el.slice(0, gt + 1);
  if (!/\bhidden\b/.test(open) && !open.includes("lg:hidden")) return el;
  return el.slice(gt + 1, -"</div>".length);
}

function wrapRoot(inner, artboard, fontClass) {
  const cls = ["kin-root", fontClass].filter(Boolean).join(" ");
  return `<div class="${cls}" data-kin-artboard="${artboard}">${inner}</div>`;
}

/**
 * Extra bytes the export does not need in a Tilda paste: default `type="button"`,
 * the long countdown slot utility, and float tails from Figma (`1563.9840000000002`).
 */
function compactHtml(html) {
  const proto = ASSET_BASE.startsWith("https:") ? ASSET_BASE.slice("https:".length) : null;
  if (proto) html = html.split(ASSET_BASE).join(proto);
  return html
    .replace(/ type="button"/g, "")
    .replace(/ first:w-auto \[\&amp;:not\(:first-child\)\]:w-\[42px\]/g, "")
    .replace(/ first:w-auto \[\&:not\(:first-child\)\]:w-\[42px\]/g, "")
    .replace(/\d+\.\d{5,}/g, (n) => String(Math.round(Number(n) * 1000) / 1000));
}

/**
 * Rewrites root-relative `/figma/…` and Next font URLs onto the CDN.
 *
 * The naive `(["'(])/figma/` pattern misses React's inline styles, which
 * serialize as `mask-image:url(&quot;/figma/mask.png&quot;)` — the character
 * sitting in front of `/figma/` is `;`, not a quote. Anything that is not
 * already a path segment (`public/figma/…` on the CDN) is fair game.
 */
function toCdn(text) {
  return text
    .replace(/(^|[^A-Za-z0-9])\/figma\//g, `$1${ASSET_BASE}figma/`)
    .replace(/(^|[^A-Za-z0-9])\/_next\/static\/media\//g, `$1${ASSET_BASE}fonts/`)
    .replace(/(^|[^A-Za-z0-9])\/type\//g, `$1${ASSET_BASE}type/`)
    ;
}

/**
 * Hero is the only eager image. Everything else is lazy so a hidden artboard
 * (desktop on a phone, mobile on a desktop) does not compete for first paint.
 */
function decorateImages(html) {
  return html.replace(/<img\b([^>]*?)(\/?)>/gi, (_, attrs, slash) => {
    const isHero = /hero-trainer/.test(attrs);
    let a = attrs;
    if (!/\bloading=/.test(a)) a += isHero ? ' loading="eager"' : ' loading="lazy"';
    if (!/\bdecoding=/.test(a)) a += ' decoding="async"';
    if (isHero && !/\bfetchpriority=/i.test(a)) a += ' fetchpriority="high"';
    return `<img${a}${slash}>`;
  });
}

function hasRootRelativeFigma(text) {
  return /(^|[^A-Za-z0-9])\/figma\//.test(text);
}

/**
 * The export already comes out tag-to-tag with no filler, so this only tidies
 * attribute values. Text nodes are left alone on purpose: whitespace between
 * inline elements is rendered, and collapsing it would move the layout.
 */
function minifyHtml(html) {
  let out = "";
  let i = 0;

  while (i < html.length) {
    if (html.startsWith("<!--", i)) {
      const end = html.indexOf("-->", i);
      i = end === -1 ? html.length : end + 3;
      continue;
    }

    if (html[i] !== "<") {
      const next = html.indexOf("<", i + 1);
      const stop = next === -1 ? html.length : next;
      out += html.slice(i, stop);
      i = stop;
      continue;
    }

    let end = i + 1;
    let quote = "";
    for (; end < html.length; end++) {
      const ch = html[end];
      if (quote) {
        if (ch === quote) quote = "";
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === ">") break;
    }
    end = Math.min(end + 1, html.length);

    out += html
      .slice(i, end)
      .replace(/=(["'])([^"']*)\1/g, (whole, q, value) => {
        const tidy = value.replace(/\s+/g, " ").trim();
        return tidy === value ? whole : `=${q}${tidy}${q}`;
      })
      .replace(/\s+data-kin-faq-item="true"/g, " data-kin-faq-item")
      .replace(/\s+aria-hidden="true"/g, " aria-hidden")
      .replace(/\s+(?=\/?>)/g, "")
      .replace(/\s{2,}/g, " ");
    i = end;
  }

  return out;
}

/* ------------------------------------------------------------- minify JS --- */

const WORD = /[A-Za-z0-9_$\\]/;
/** After one of these a `/` opens a regex literal rather than dividing. */
const REGEX_ALLOWED_AFTER = /[({[,;:=!&|?+\-*%~^<>]/;

/**
 * Strips comments and needless whitespace from the runtime. It is a tokeniser,
 * not a regex sweep, so string, template and regex literals survive intact;
 * `build()` then parses the result to prove nothing was mangled.
 */
function minifyJs(js) {
  let out = "";
  let gap = false;
  let i = 0;

  /** Emits the single space that a skipped run of whitespace/comments needs. */
  const flush = (next) => {
    if (!gap) return;
    gap = false;
    const prev = out[out.length - 1];
    if (prev === undefined || next === undefined) return;
    if ((WORD.test(prev) && WORD.test(next)) || (prev === next && "+-".includes(prev))) {
      out += " ";
    }
  };

  while (i < js.length) {
    const ch = js[i];

    if (/\s/.test(ch)) {
      gap = true;
      i++;
      continue;
    }

    if (ch === "/" && js[i + 1] === "/") {
      const end = js.indexOf("\n", i);
      i = end === -1 ? js.length : end;
      gap = true;
      continue;
    }

    if (ch === "/" && js[i + 1] === "*") {
      const end = js.indexOf("*/", i + 2);
      i = end === -1 ? js.length : end + 2;
      gap = true;
      continue;
    }

    flush(ch);

    if (ch === '"' || ch === "'" || ch === "`") {
      let j = i + 1;
      while (j < js.length && js[j] !== ch) j += js[j] === "\\" ? 2 : 1;
      out += js.slice(i, Math.min(j + 1, js.length));
      i = j + 1;
      continue;
    }

    if (ch === "/" && REGEX_ALLOWED_AFTER.test(out[out.length - 1] || "(")) {
      let j = i + 1;
      let inClass = false;
      while (j < js.length) {
        if (js[j] === "\\") j += 2;
        else if (js[j] === "[") (inClass = true), j++;
        else if (js[j] === "]") (inClass = false), j++;
        else if (js[j] === "/" && !inClass) break;
        else j++;
      }
      while (j + 1 < js.length && /[gimsuy]/.test(js[j + 1])) j++;
      out += js.slice(i, Math.min(j + 1, js.length));
      i = j + 1;
      continue;
    }

    out += ch;
    i++;
  }

  return out;
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
  /*
   * Tilda renders each HTML block on its own, and the order in which they run
   * is not the order they appear in, so the markup may not exist yet when this
   * executes. Keep looking until .kin-root shows up. Markup is split across
   * T123 records (desktop + mobile), so there may be two roots.
   */
  var mo;
  var tries=0;
  function boot(){
    var wraps=document.querySelectorAll('.kin-root');
    if(!wraps.length)return false;
    [].forEach.call(wraps,function(wrap){
      if(wrap.dataset.kinReady)return;
      wrap.dataset.kinReady='1';
      init(wrap);
    });
    /* Combined preview is one root; Tilda paste is two artboard roots. */
    var arts=document.querySelectorAll('.kin-root[data-kin-artboard]');
    if(arts.length>=2||(wraps.length&&!arts.length)||++tries>300){
      if(mo)mo.disconnect();
      return true;
    }
    return false;
  }
  function watch(){
    if(boot())return;
    setTimeout(watch,50);
  }
  if(window.MutationObserver){
    mo=new MutationObserver(function(){boot();});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',watch);
  }
  window.addEventListener('load',watch);
  watch();

function init(wrap){
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
  /*
   * The display face is wider than the Manrope fallback, so headings reflow
   * when it lands. Force the download, then refit once document.fonts.ready
   * says it is actually in use.
   */
  if(document.fonts){
    try{document.fonts.load('400 32px "Murs Gothic Wide Dark"');}catch(e){}
    if(document.fonts.ready){
      document.fonts.ready.then(function(){
        var ok=false;
        try{ok=document.fonts.check('400 32px "Murs Gothic Wide Dark"');}catch(e){}
        wrap.setAttribute('data-kin-display',ok?'1':'0');
        fit();
      });
    }
  }

  /* FAQ: one open item per block — the desktop columns share a group, so
     opening on the right closes the left. CSS animates grid-template-rows. */
  wrap.addEventListener('click',function(e){
    var button=e.target.closest&&e.target.closest('[data-kin-faq-item] button');
    if(!button)return;
    var item=button.closest('[data-kin-faq-item]');
    var open=item.getAttribute('data-kin-open')!=='true';
    var group=button.closest('[data-kin-faq-group]')||item.parentNode;
    [].forEach.call(group.querySelectorAll('[data-kin-faq-item]'),function(sibling){
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
        /* Компактный таймер в плавающей кнопке показывает часы от полного
           остатка, без отдельных суток. */
        var parts=timer.hasAttribute('data-kin-countdown-total-hours')
          ?[0,Math.floor(left/3600),Math.floor(left%3600/60),left%60]
          :[Math.floor(left/86400),Math.floor(left%86400/3600),Math.floor(left%3600/60),left%60];
        parts.forEach(function(value,i){
          var slot=timer.querySelector('[data-kin-countdown-value="'+i+'"]');
          if(slot)slot.textContent=pad(value);
        });
      });
    };
    tick();
    setInterval(tick,1000);
  }

  /* Click-to-play video: hand the frame over to the native controls. */
  wrap.addEventListener('click',function(e){
    var play=e.target.closest&&e.target.closest('[data-kin-video-play]');
    if(!play)return;
    var box=play.closest('[data-kin-video]');
    if(!box)return;
    var video=box.querySelector('[data-kin-video-el]');
    box.setAttribute('data-kin-playing','true');
    if(video){video.controls=true;var p=video.play();if(p&&p.catch)p.catch(function(){});}
  });

  /* Sticky mobile CTA: out while a section with its own «Купить» is on screen. */
  var sticky=wrap.querySelector('[data-kin-sticky-cta]');
  var stops=[].slice.call(wrap.querySelectorAll('[data-kin-cta-stop]'));
  if(sticky&&stops.length&&window.IntersectionObserver){
    var shown=[];
    var sio=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var i=shown.indexOf(entry.target);
        if(entry.isIntersecting){if(i<0)shown.push(entry.target);}
        else if(i>=0)shown.splice(i,1);
      });
      sticky.setAttribute('data-kin-show',shown.length?'false':'true');
    },{rootMargin:'-15% 0px -15% 0px'});
    stops.forEach(function(el){sio.observe(el);});
  }

  /*
   * Полноширинная полоса перекрывает виджет чата, а он — чужой и по имени
   * не выбирается. Поднимаем всё, что зафиксировано в правом нижнем углу и
   * не принадлежит нам, на высоту полосы, пока она видна.
   */
  if(sticky&&sticky.className.indexOf('inset-x-0')>=0){
    var lifted=[];
    var nudge=function(){
      var up=sticky.getAttribute('data-kin-show')==='true'
        ? Math.round(sticky.getBoundingClientRect().height) : 0;
      lifted.forEach(function(el){el.style.transform='';});
      lifted=[];
      [].forEach.call(document.body.children,function(el){
        if(el===sticky||el.contains(sticky))return;
        var cs=window.getComputedStyle(el);
        if(cs.position!=='fixed')return;
        var r=el.getBoundingClientRect();
        if(!r.width||!r.height)return;
        if(window.innerHeight-r.bottom>140)return;
        if(window.innerWidth-r.right>140)return;
        el.style.transition='transform .25s ease';
        if(up)el.style.transform='translateY(-'+up+'px)';
        lifted.push(el);
      });
    };
    if(window.MutationObserver){
      new MutationObserver(function(m){
        for(var i=0;i<m.length;i++){
          if(m[i].type==='attributes'){nudge();return;}
        }
      }).observe(sticky,{attributes:true,attributeFilter:['data-kin-show']});
    }
    setTimeout(nudge,1200);
    window.addEventListener('resize',nudge);
  }

  /* Scroll reveal: fade/slide sections in once. */
  var nodes=[].slice.call(wrap.querySelectorAll('[data-kin-reveal]'));
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!window.IntersectionObserver){
    nodes.forEach(function(el){el.classList.add('kin-in');});
  }else{
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting)return;
        entry.target.classList.add('kin-in');
        io.unobserve(entry.target);
      });
    },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
    nodes.forEach(function(el){io.observe(el);});
  }
}
})();`;

/* ---------------------------------------------------------------- build --- */

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

function writeFile(file, contents) {
  fs.writeFileSync(file, contents, "utf8");
  return { file, size: Buffer.byteLength(contents) };
}

function build() {
  const { html, css } = readExport();
  const { markup, fontClass } = extractMarkup(html);
  wrapClasses = new Set(fontClass.split(/\s+/).filter(Boolean));

  const { faces: pickedFaces, files } = pickFontFaces(css);
  copyFonts(files);
  const faces = withDisplayFace(pickedFaces);

  const rules = css.replace(/@font-face\{[^}]*\}/g, "");
  // next/font injects "Manrope Fallback" as size-adjusted Arial. Drop the name
  // so a missed woff2 cannot paint stretched system sans.
  const scoped = minifyCss(
    scopeCss(rules)
      .replace(/,"(?:Unbounded|Manrope) Fallback"/g, "")
      .replace(/,(?:Unbounded|Manrope) Fallback/g, "")
  );
  const reset = `${WRAP}{box-sizing:border-box;display:block;width:100%!important;min-width:100%;max-width:100%;text-align:left;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}`;
  // Lock families by name: Tailwind's `--font-display: var(--font-display)` is
  // circular, and a metric-adjusted Arial fallback would paint headings as
  // stretched system sans instead of the real display face.
  const fontLock =
    `${WRAP}{--font-manrope:"Manrope";--font-display:"${DISPLAY_FAMILY}";font-family:"Manrope",system-ui,sans-serif;font-weight:500}` +
    `${WRAP} .font-display{font-family:"${DISPLAY_FAMILY}",Manrope,system-ui,sans-serif!important;font-weight:400;letter-spacing:normal;font-synthesis-weight:none}`;
  // Each T123 is a sibling `.t-rec`, so artboards cannot share one wrap.
  // Hide the whole record (not just the inner canvas) to avoid empty gaps.
  const artboardCss = minifyCss(
    `${WRAP}[data-kin-artboard=desktop]{display:none}${WRAP}[data-kin-artboard=mobile]{display:block}` +
      `@media (min-width:64rem){${WRAP}[data-kin-artboard=desktop]{display:block}${WRAP}[data-kin-artboard=mobile]{display:none}}` +
      `@media (max-width:63.99rem){.t-rec:has(${WRAP}[data-kin-artboard=desktop]){display:none!important;padding:0!important;margin:0!important;min-height:0!important;overflow:hidden!important}}` +
      `@media (min-width:64rem){.t-rec:has(${WRAP}[data-kin-artboard=mobile]){display:none!important;padding:0!important;margin:0!important;min-height:0!important;overflow:hidden!important}}` +
      `${WRAP} [data-kin-countdown]>div:first-child{width:auto}${WRAP} [data-kin-countdown]>div:not(:first-child){width:42px}`
  );
  const finalCss = toCdn(minifyCss(faces.join("")) + reset + scoped + fontLock + artboardCss);
  const finalMarkup = compactHtml(toCdn(minifyHtml(toCdn(decorateImages(markup)))));
  const { desktop, mobile } = splitArtboards(finalMarkup);
  const desktopTag = wrapRoot(desktop, "desktop", fontClass);
  const mobileTag = wrapRoot(mobile, "mobile", fontClass);
  const combinedTag = `<div class="kin-root ${fontClass}">${finalMarkup}</div>`;
  const finalJs = minifyJs(RUNTIME);

  // Cheap parse check: proves the minifier did not mangle the runtime.
  new Function(finalJs);

  const stamp = new Date().toISOString().slice(0, 10);
  const heroPreload = `<link rel="preload" as="image" href="${ASSET_BASE}${HERO_IMG}" media="(min-width:64rem)">`;
  const unboundedPreload = `<link rel="preload" as="font" href="${toCdn(DISPLAY_FONT_URL)}" type="font/woff2" crossorigin>`;
  const styleTag = `<style>${finalCss}</style>`;
  const scriptTag = `<script>${finalJs}</script>`;
  const note = (n, total, what) =>
    `<!-- Энциклопедия тренера · блок ${n}/${total} · ${what} · ${stamp} -->`;

  if (fs.existsSync(LEGACY_HTML_FILE)) fs.unlinkSync(LEGACY_HTML_FILE);

  const parts = [
    writeFile(CSS_FILE, `${note(1, 4, "стили, вставить первым")}${heroPreload}${unboundedPreload}${styleTag}`),
    writeFile(
      HTML_DESKTOP_FILE,
      `${note(2, 4, "разметка 1440, вставить вторым")}${desktopTag}`
    ),
    writeFile(
      HTML_MOBILE_FILE,
      `${note(3, 4, "разметка 430, вставить третьим")}${mobileTag}`
    ),
    writeFile(JS_FILE, `${note(4, 4, "скрипт, вставить четвёртым")}${scriptTag}`),
  ];

  const combined = writeFile(
    OUT_FILE,
    `<meta charset="UTF-8">
<!-- Энциклопедия тренера · один блок T123 · ${stamp} · ассеты: ${ASSET_BASE} -->
${heroPreload}
${unboundedPreload}
${styleTag}
${combinedTag}
${scriptTag}
`
  );

  fs.mkdirSync(TILDA_ASSET_DIR, { recursive: true });
  fs.writeFileSync(path.join(TILDA_ASSET_DIR, "kin.css"), finalCss, "utf8");
  fs.writeFileSync(path.join(TILDA_ASSET_DIR, "kin.js"), finalJs, "utf8");

  const external = writeFile(
    EXTERNAL_FILE,
    `<meta charset="UTF-8">
<!-- Энциклопедия тренера · внешние CSS+JS · вставить вместо блоков 1 и 4; между ними — tilda-2a и tilda-2b · ${stamp} · 404 на jsDelivr, пока public/tilda/ не в GitHub -->
<link rel="stylesheet" href="${ASSET_BASE}tilda/kin.css">
<script src="${ASSET_BASE}tilda/kin.js" defer></script>
`
  );

  const pasteHtml = desktop + mobile;
  const checks = {
    scopedCss: finalCss.includes(`${WRAP} .`),
    noGlobalReset: !/(^|[};])(html|body|\*)\{/.test(finalCss),
    noLayers: !finalCss.includes("@layer"),
    noCssComments: !finalCss.includes("/*"),
    cdnImages:
      finalMarkup.includes(`${ASSET_BASE}figma/`) ||
      finalMarkup.includes(`${ASSET_BASE.replace(/^https:/, "")}figma/`),
    cdnFonts: finalCss.includes(`${ASSET_BASE}fonts/`),
    cdnMasks:
      /mask-image:url\((?:&quot;|["'])/.test(finalMarkup) &&
      (finalMarkup.includes(`${ASSET_BASE}figma/`) ||
        finalMarkup.includes(`${ASSET_BASE.replace(/^https:/, "")}figma/`)) &&
      !/url\((?:&quot;|["'])\/figma\//.test(finalMarkup),
    noRootFigma: !hasRootRelativeFigma(finalCss + finalMarkup),
    noNextScripts: !finalMarkup.includes("/_next/static/chunks"),
    desktop: desktop.includes('data-kin-canvas="1440"') && !desktop.includes('data-kin-canvas="430"'),
    mobile: mobile.includes('data-kin-canvas="430"') && !mobile.includes('data-kin-canvas="1440"'),
    kinRoot: desktopTag.includes("kin-root") && mobileTag.includes("kin-root"),
    faq: desktop.includes("data-kin-faq-item") && mobile.includes("data-kin-faq-item"),
    faqSingleOpen:
      desktop.includes("data-kin-faq-group") &&
      finalJs.includes("data-kin-faq-group") &&
      (desktop.match(/data-kin-open="true"/g) || []).length === 1,
    countdown: desktop.includes("data-kin-countdown") && mobile.includes("data-kin-countdown"),
    countdownMsk: pasteHtml.includes(String(SALE_END_MS)),
    deferredBoot:
      finalJs.includes("DOMContentLoaded") &&
      finalJs.includes("setTimeout(watch") &&
      finalJs.includes("MutationObserver") &&
      finalJs.includes(".kin-root"),
    fontsReady:
      finalJs.includes("fonts.ready") &&
      finalJs.includes("fonts.check") &&
      finalJs.includes(DISPLAY_FAMILY),
    fontLock:
      finalCss.includes(`--font-display:"${DISPLAY_FAMILY}"`) &&
      finalCss.includes(`font-family:"${DISPLAY_FAMILY}"`),
    displayFontCdn: finalCss.includes(`${ASSET_BASE}type/murs-gothic-wide-dark.woff2`),
    noDisplayFallback: !finalCss.includes(`${DISPLAY_FAMILY} Fallback`),
    artboardCss: finalCss.includes("data-kin-artboard"),
    oneLineParts: parts.every((part) => !fs.readFileSync(part.file, "utf8").includes("\n")),
    underLimit: parts.every((part) => part.size < PASTE_LIMIT),
    noHeader: !/<header\b/i.test(pasteHtml),
    noFooter: !/<footer\b/i.test(pasteHtml),
    noIframe: !/<iframe\b/i.test(pasteHtml + finalJs + finalCss),
    noFigmaPng: !/\/figma\/[A-Za-z0-9._-]+\.png\b/.test(pasteHtml + finalCss),
    webpHero: desktop.includes("hero-trainer.webp"),
    lazyImages: desktop.includes('loading="lazy"') && mobile.includes('loading="lazy"'),
    heroEager: /hero-trainer[^>]*loading="eager"/.test(desktop),
    heroPreload: fs.readFileSync(CSS_FILE, "utf8").includes(`rel="preload"`) &&
      fs.readFileSync(CSS_FILE, "utf8").includes(HERO_IMG),
    displayFace: faces.filter((f) => f.includes(DISPLAY_FAMILY)).length === 1,
    manropeNo400: !faces.some((f) => /Manrope/.test(f) && /font-weight:400/.test(f)),
    noGeist: !faces.some((f) => /Geist/.test(f)),
    reveal: desktop.includes("data-kin-reveal") && mobile.includes("data-kin-reveal"),
    faqGrid: finalCss.includes("grid-template-rows") && finalJs.includes("data-kin-open"),
    io: finalJs.includes("IntersectionObserver") && finalJs.includes("kin-in"),
    buyBlank: pasteHtml.includes('target="_blank"') && pasteHtml.includes("noopener noreferrer"),
    checkoutFull: (pasteHtml.match(new RegExp(CHECKOUT_FULL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length >= 6,
    supportTg: (pasteHtml.match(new RegExp(SUPPORT_TG.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length >= 2,
    video:
      desktop.includes("data-kin-video") &&
      mobile.includes("data-kin-video") &&
      finalJs.includes("data-kin-video-play") &&
      pasteHtml.includes("figma/angles.mp4"),
    stickyCtaFull:
      /data-kin-sticky-cta[^>]*inset-x-0/.test(mobile) &&
      /data-kin-sticky-cta[\s\S]{0,900}data-kin-countdown/.test(mobile),
    stickyCta:
      mobile.includes("data-kin-sticky-cta") &&
      desktop.includes("data-kin-sticky-cta") &&
      mobile.includes("data-kin-cta-stop") &&
      desktop.includes("data-kin-cta-stop") &&
      finalJs.includes("data-kin-sticky-cta"),
    gapScale:
      finalCss.includes("kin-gap") &&
      finalCss.includes("kin-tail") &&
      !/\bmt-\[(?:120|138|151|124|68)px\]/.test(pasteHtml),
  };

  const allOut = [...parts, combined, external];
  for (const part of allOut) {
    const text = fs.readFileSync(part.file, "utf8");
    if (hasRootRelativeFigma(text)) {
      throw new Error(`root-relative /figma/ left in ${path.basename(part.file)}`);
    }
  }

  const failed = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([name]) => name);

  for (const part of allOut) {
    const flag = part.size >= PASTE_LIMIT && parts.includes(part) ? "  ← over 50 KB" : "";
    console.log(`Wrote ${path.basename(part.file)} · ${kb(part.size)}${flag}`);
  }
  console.log(`  ${faces.length} font faces · ${files.size} woff2 · assets: ${ASSET_BASE}`);
  if (failed.length) throw new Error(`Checks failed: ${failed.join(", ")}`);
}

build();
