// Turns the content in content.js into HTML pieces.
// Used in two places: by build.mjs (to write finished HTML for search engines)
// and by script.js (so index.html also works when opened straight from disk).
(function (root) {
  function esc(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function list(items, fn) {
    return (items || []).map(fn).join("");
  }

  function renderSections(c) {
    const full = `${c.name.first} ${c.name.last}`;
    const ct = c.contact || {};

    const contact = [];
    if (ct.email) contact.push(`<a class="btn btn--solid" href="mailto:${esc(ct.email)}">Email me</a>`);
    if (ct.linkedin) contact.push(`<a class="btn" href="${esc(ct.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>`);
    if (ct.cv) contact.push(`<a class="btn" href="${esc(ct.cv)}" download>Download CV</a>`);

    return {
      fullName: esc(full),
      firstName: esc(c.name.first),
      tag: esc(c.tag || ""),

      highlights: list(c.highlights, h => `
      <div class="stat">
        <span class="stat__value">${esc(h.value)}</span>
        <span class="stat__label">${esc(h.label)}</span>
      </div>`),

      experience: list(c.experience, j => `
          <article class="job">
            <h3 class="job__role">${esc(j.role)}</h3>
            <p class="job__meta">${esc(j.org)} | ${esc(j.period)}</p>
            <ul>${list(j.points, p => `<li>${esc(p)}</li>`)}</ul>
          </article>`),

      earlier: list(c.earlier, e => `
            <li><span><strong>${esc(e.role)}</strong>, ${esc(e.org)}</span><span class="period">${esc(e.period)}</span></li>`),

      education: list(c.education, e => `
          <div class="edu">
            <p class="edu__degree">${esc(e.degree)} (${esc(e.period)})</p>
            <p>${esc(e.school)}</p>
          </div>`),

      portrait: c.photo
        ? `<img src="${esc(c.photo)}" alt="${esc(c.photoAlt || full)}" width="600" height="660">`
        : `<span class="portrait__placeholder" aria-hidden="true">${esc(c.name.first[0] + c.name.last[0])}</span>`,

      bigname: `${esc(c.name.first)}<br>${esc(c.name.last)}<small>${esc(c.role)} · ${esc(c.location)}</small>`,

      profile: list(c.profile, p => `<p>${esc(p)}</p>`),
      contact: contact.join(""),
      languages: list(c.languages, l => `<li>${esc(l.name)} (${esc(l.level)})</li>`),
      certifications: list(c.certifications, s => `<li>${esc(s)}</li>`),
      skills: list(c.skills, s => `<li>${esc(s)}</li>`),
      footer: `© ${new Date().getFullYear()} ${esc(full)}`
    };
  }

  const api = { renderSections, esc };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SiteRender = api;
})(this);
