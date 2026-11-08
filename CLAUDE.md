# Anna Tourtoura – personal website

A static one-page site (HTML, CSS, JS) hosted on GitHub Pages. Anna updates it by asking Claude in plain words. She is not a developer, so explain changes simply and avoid jargon.

## Where things live
- `content.js`: ALL of Anna's text (profile, highlights, experience, education, languages, skills, certifications, contact links, photo path). Almost every request only needs this file.
- `style.css`: the design. Colors and fonts are at the top under "Design tokens".
- `index.html`: page structure. `script.js`: reads content.js and fills the page.
- `assets/`: photo, CV PDF, favicon.

## Rules
1. Content changes ("add my new role", "update my profile", "new certification") go in `content.js` only. Keep the existing field names and structure, and keep the file valid JavaScript (quotes, commas, brackets).
2. Newest experience goes first. Older roles that matter less can move to the `earlier` list.
3. Keep the design: two colors (blue on grey paper), Inter Tight, thin hairline grid, no animations. Only change the design when Anna asks for it.
4. Ask before deleting a section or removing a past role.
5. Never invent facts, numbers or achievements. If something is missing (dates, figures), ask Anna.
6. Keep the writing clear, first person in the profile, short bullet points in experience. British or American spelling, consistent with the existing text.
7. To change the photo: Anna uploads an image; save it as `assets/anna.jpg` (or similar) and set `"photo": "assets/anna.jpg"` in content.js. To change the CV, replace `assets/Anna-Tourtoura-CV.pdf`.
8. Don't add a phone number or home address unless Anna explicitly asks. This repo and site are public.
9. After a change, summarise in one or two sentences what changed, in plain words. Then open a pull request (or commit to `main` if Anna asks to publish directly). The site updates about a minute after the change reaches `main`.
