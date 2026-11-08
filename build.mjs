// Builds the finished website into the _site folder.
// GitHub runs this automatically on every change (see .github/workflows/pages.yml).
// Run locally with:  node build.mjs   (add --offline to skip downloading fonts)
//
// What it does:
// 1. Reads Anna's content from content.js
// 2. Writes it into index.html as plain HTML, so search engines, AI assistants
//    and LinkedIn previews can read it without running JavaScript
// 3. Adds search info (description, share card, structured data)
// 4. Downloads the font so it's served from the site itself (no Google requests)
// 5. Writes robots.txt, sitemap.xml and a 404 page

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { renderSections, esc } = require("./render.js");

const OUT = "_site";
const offline = process.argv.includes("--offline");

// ---------- 1. Load content ----------
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync("content.js", "utf8"), sandbox);
const c = sandbox.window.SITE_CONTENT;
if (!c) throw new Error("content.js did not define window.SITE_CONTENT");

const site = (c.siteUrl || "").replace(/\/$/, "");
const full = `${c.name.first} ${c.name.last}`;
const title = `${full} · ${c.role}`;
const description = c.seoDescription || (c.profile || [])[0] || "";
const ogImage = fs.existsSync("assets/og-image.png") ? `${site}/assets/og-image.png` : "";

// ---------- 2. Structured data (who Anna is, for search engines) ----------
const current = (c.experience || [])[0];
const [city, country] = (c.location || "").split(",").map(s => s.trim());
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: full,
  url: site + "/",
  jobTitle: c.role,
  description,
  ...(current ? { worksFor: { "@type": "Organization", name: current.org } } : {}),
  ...(city ? { address: { "@type": "PostalAddress", addressLocality: city, addressCountry: country || "" } } : {}),
  ...(c.photo ? { image: `${site}/${c.photo}` } : {}),
  sameAs: [c.contact && c.contact.linkedin].filter(Boolean),
  alumniOf: [...new Set((c.education || []).map(e => e.school))].map(name => ({ "@type": "EducationalOrganization", name })),
  knowsLanguage: (c.languages || []).map(l => l.name),
  knowsAbout: c.skills || []
};

const head = `
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${site}/">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${site}/">
  <meta property="profile:first_name" content="${esc(c.name.first)}">
  <meta property="profile:last_name" content="${esc(c.name.last)}">
  ${ogImage ? `<meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">` : ""}
  <meta name="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}">
  <script type="application/ld+json">${JSON.stringify(person).replace(/</g, "\\u003c")}</script>`;

// ---------- 3. Fonts: download and serve from the site ----------
async function selfHostFonts() {
  const cssUrl = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;700;800&display=swap";
  const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
  const css = await (await fetch(cssUrl, { headers: { "User-Agent": ua } })).text();
  const urls = [...new Set([...css.matchAll(/url\((https:[^)]+\.woff2)\)/g)].map(m => m[1]))];
  if (!urls.length) throw new Error("no font files found");
  fs.mkdirSync(path.join(OUT, "fonts"), { recursive: true });
  let local = css;
  for (const [i, url] of urls.entries()) {
    const file = `inter-tight-${i}.woff2`;
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    fs.writeFileSync(path.join(OUT, "fonts", file), buf);
    local = local.split(url).join(file);
  }
  fs.writeFileSync(path.join(OUT, "fonts", "fonts.css"), local);
  return `<link rel="stylesheet" href="fonts/fonts.css">`;
}

// ---------- Build ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let fontsTag = null;
if (!offline) {
  try {
    fontsTag = await selfHostFonts();
    console.log("Fonts: self-hosted");
  } catch (e) {
    console.warn("Fonts: download failed, keeping Google Fonts link (" + e.message + ")");
  }
}

const parts = renderSections(c);
let html = fs.readFileSync("index.html", "utf8");

html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
html = html.replace("<!--@head-->", head);
html = html.replace(/<!--@fonts-->([\s\S]*?)<!--@\/fonts-->/, (_, google) => fontsTag || google.trim());
html = html.replace(/\s*<!--@scripts-->[\s\S]*?<!--@\/scripts-->/, "");
html = html.replace(/<!--@(\w+)-->/g, (m, key) => (key in parts ? parts[key] : m));

const leftover = html.match(/<!--@\w+-->/);
if (leftover) throw new Error("Unfilled marker in index.html: " + leftover[0]);

fs.writeFileSync(path.join(OUT, "index.html"), html);

// Static files
for (const f of ["style.css", "CNAME"]) if (fs.existsSync(f)) fs.copyFileSync(f, path.join(OUT, f));
fs.cpSync("assets", path.join(OUT, "assets"), { recursive: true });

// robots.txt and sitemap.xml
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, "sitemap.xml"),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>
</urlset>
`);

// 404 page in the same style
fs.writeFileSync(path.join(OUT, "404.html"), `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page not found · ${esc(full)}</title>
  <meta name="robots" content="noindex">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  ${(fontsTag || "").replace('href="fonts/', 'href="/fonts/')}
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="sheet">
    <header class="hero">
      <h1 class="hero__title">404.</h1>
    </header>
    <section class="block" style="padding: 40px var(--pad) 80px;">
      <h2>This page doesn't exist.</h2>
      <p style="margin-bottom: 24px;">The link may be old or mistyped.</p>
      <a class="btn btn--solid" href="/">Go to ${esc(full)}'s homepage</a>
    </section>
  </div>
</body>
</html>
`);

console.log(`Built ${OUT}/ for ${site}`);
