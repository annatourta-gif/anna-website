# Anna Tourtoura – personal website

Static one-page site: `index.html`, `style.css`, `script.js`, with all text in `content.js`.

## 1. Put the site on GitHub
1. Create a free GitHub account (Anna's, or yours with Anna added as a collaborator).
2. Create a new **public** repository, e.g. `anna-website`.
3. Click **Add file → Upload files** and drag in everything from this folder, including the `assets` folder and the hidden `.nojekyll` file. Commit to `main`.

## 2. Turn on GitHub Pages
1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**. Save.
3. After a minute the site is live at `https://<username>.github.io/anna-website/`.

## 3. Connect the domain
1. In **Settings → Pages → Custom domain**, enter the domain (e.g. `annatourtoura.gr`) and save. GitHub adds a `CNAME` file to the repo.
2. At the domain registrar (e.g. Papaki), open the DNS settings and add:
   - Four **A** records for the bare domain (`@`):
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A **CNAME** record for `www` pointing to `<username>.github.io`
3. Wait for DNS to update (minutes to a few hours), then tick **Enforce HTTPS** in Settings → Pages.

Check GitHub's current guide if anything differs: docs.github.com → "Managing a custom domain for your GitHub Pages site".

## 4. How Anna updates the site with Claude
1. Open Claude (desktop, mobile or claude.ai) → **Code**, and connect GitHub the first time.
2. Choose the `anna-website` repository.
3. Ask in plain words, e.g. *"Add a new certification: PRINCE2 Foundation, 2027"* or *"Use this photo as my portrait"* (attach it).
4. Claude makes the change and opens a pull request. Open it on GitHub and click **Merge**. The live site updates in about a minute.
5. If something looks wrong, ask Claude to fix or undo it.

`CLAUDE.md` tells Claude the rules for editing this site.

## Previewing locally (optional)
Double-click `index.html` to open it in your browser.
