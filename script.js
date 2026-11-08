// Fills the page from content.js. Anna's text lives in content.js, not here.

function esc(text) {
  const div = document.createElement("div");
  div.textContent = text == null ? "" : String(text);
  return div.innerHTML;
}

function setList(id, items, render) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = (items || []).map(render).join("");
}

function render(c) {
  const full = `${c.name.first} ${c.name.last}`;

  document.querySelectorAll('[data-field="fullName"]').forEach(el => (el.textContent = full));
  document.querySelectorAll('[data-field="firstName"]').forEach(el => (el.textContent = c.name.first));
  document.querySelectorAll('[data-field="tag"]').forEach(el => (el.textContent = c.tag || ""));

  // Highlights
  setList("highlights", c.highlights, h => `
    <div class="stat">
      <span class="stat__value">${esc(h.value)}</span>
      <span class="stat__label">${esc(h.label)}</span>
    </div>`);

  // Experience
  setList("experience-list", c.experience, j => `
    <article class="job">
      <h3 class="job__role">${esc(j.role)}</h3>
      <p class="job__meta">${esc(j.org)} | ${esc(j.period)}</p>
      <ul>${(j.points || []).map(p => `<li>${esc(p)}</li>`).join("")}</ul>
    </article>`);

  setList("earlier-list", c.earlier, e => `
    <li><span><strong>${esc(e.role)}</strong>, ${esc(e.org)}</span><span class="period">${esc(e.period)}</span></li>`);

  // Education
  setList("education-list", c.education, e => `
    <div class="edu">
      <p class="edu__degree">${esc(e.degree)} (${esc(e.period)})</p>
      <p>${esc(e.school)}</p>
    </div>`);

  // Portrait: photo if set, otherwise initials
  const portrait = document.getElementById("portrait");
  if (c.photo) {
    portrait.innerHTML = `<img src="${esc(c.photo)}" alt="${esc(c.photoAlt || full)}">`;
  } else {
    portrait.innerHTML = `<span class="portrait__placeholder" aria-hidden="true">${esc(c.name.first[0] + c.name.last[0])}</span>`;
  }

  document.getElementById("bigname").innerHTML =
    `${esc(c.name.first)}<br>${esc(c.name.last)}<small>${esc(c.role)} · ${esc(c.location)}</small>`;

  setList("profile-text", c.profile, p => `<p>${esc(p)}</p>`);

  // Contact buttons
  const ct = c.contact || {};
  const links = [];
  if (ct.email) links.push(`<a class="btn btn--solid" href="mailto:${esc(ct.email)}">Email me</a>`);
  if (ct.linkedin) links.push(`<a class="btn" href="${esc(ct.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>`);
  if (ct.cv) links.push(`<a class="btn" href="${esc(ct.cv)}" download>Download CV</a>`);
  document.getElementById("contact-links").innerHTML = links.join("");

  setList("languages-list", c.languages, l => `<li>${esc(l.name)} (${esc(l.level)})</li>`);
  setList("cert-list", c.certifications, s => `<li>${esc(s)}</li>`);
  setList("skills-list", c.skills, s => `<li>${esc(s)}</li>`);

  document.getElementById("footer-text").textContent = `© ${new Date().getFullYear()} ${full}`;
}

if (window.SITE_CONTENT) {
  render(window.SITE_CONTENT);
} else {
  document.getElementById("profile-text").innerHTML =
    "<p>Content couldn't load. Check that content.js is next to index.html.</p>";
}
