# Anna Tourtoura – personal website

Live at **https://annatourtoura.com**

A one-page site. All text is in `content.js`. On every change to `main`, GitHub runs `build.mjs`, which writes the finished page as plain HTML (readable by Google, AI assistants and LinkedIn previews), and publishes it.

## How Anna updates the site with Claude
1. Open Claude (desktop, mobile or claude.ai) → **Code**. The first time, connect GitHub as `annatourta-gif`.
2. Choose the `anna-website` repository.
3. Ask in plain words, e.g. *"Add a new certification: PRINCE2 Foundation, 2027"* or *"Use this photo as my portrait"* (attach it).
4. Claude makes the change and opens a pull request. Open it on GitHub and click **Merge**. The live site updates in about two minutes (watch progress under the repo's **Actions** tab).
5. If something looks wrong, ask Claude to fix or undo it. Every past version is kept.

`CLAUDE.md` tells Claude the rules for editing this site.

## Setup reference
- **Hosting:** GitHub Pages, Settings → Pages → Source: **GitHub Actions**. Custom domain `annatourtoura.com`, Enforce HTTPS on.
- **Domain:** Papaki. DNS records:
  - A `annatourtoura.com` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - CNAME `www.annatourtoura.com` → `annatourta-gif.github.io.`
  - Leave Papaki's email records (MX, TXT, SRV, _dmarc, autoconfig, imap, pop, smtp) in place.

## Previewing locally (optional)
- Quick look: double-click `index.html`.
- Exact live version: `node build.mjs`, then open `_site/index.html` through a local server (`python3 -m http.server -d _site`).
