import { type Page } from "../types/page";

function renderTree(pages: Page[]): HTMLElement | null {
  if (!pages || pages.length === 0) return null;

  const ul = document.createElement("ul");
  ul.classList.add("nav-list");

  for (const page of pages) {
    const li = document.createElement("li");
    const hasChildren = page.children && page.children.length > 0;

    if (hasChildren) {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = page.title;

      details.appendChild(summary);

      // Das Kind-Menü wird zum Container für die nächste Ebene
      const childrenUl = renderTree(page.children);
      if (childrenUl) {
        // Wir fügen einen "Zurück"-Button am Anfang der Unterliste hinzu
        const backBtn = document.createElement("button");
        backBtn.textContent = "← Zurück";
        backBtn.onclick = () => (details.open = false);
        childrenUl.prepend(backBtn);

        details.appendChild(childrenUl);
      }
      li.appendChild(details);
    } else {
      const a = document.createElement("a");
      a.href = page.fullPath;
      a.textContent = page.title;
      li.appendChild(a);
    }
    ul.appendChild(li);
  }
  return ul;
}

export function renderNavMenu(pages: Page[]) {
  const menu = renderTree(pages);
  const nav = document.createElement("nav");
  nav.classList.add("main-nav");
  if (menu) nav.appendChild(menu);
  return nav;
}
