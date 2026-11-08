// Local preview only: fills index.html from content.js when you open it straight from disk.
// The live site doesn't use this file. build.mjs writes finished HTML instead.
(function () {
  const c = window.SITE_CONTENT;
  if (!c || !window.SiteRender) return;
  const parts = window.SiteRender.renderSections(c);

  // Replace every <!--@key--> marker with its HTML.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT);
  const markers = [];
  while (walker.nextNode()) markers.push(walker.currentNode);
  markers.forEach(node => {
    const key = node.nodeValue.trim().replace(/^@/, "");
    if (!(key in parts)) return;
    const tpl = document.createElement("template");
    tpl.innerHTML = parts[key];
    node.replaceWith(tpl.content);
  });
})();
