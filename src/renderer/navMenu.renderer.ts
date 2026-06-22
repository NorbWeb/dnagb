import { type Page } from "../types/page";

function renderTree(pages: Page[]): HTMLElement | null {
  if (!pages || pages.length === 0) return null;
  const ul = document.createElement("ul");
  ul.classList.add("nav-list");
  for (const page of pages) {
    if (page.link_location !== "menu") return null;

    const li = document.createElement("li");
    li.classList.add("nav-item");

    // Falls Kinder existieren: <details>-Element erstellen
    if (page.children && page.children.length > 0) {
      const details = document.createElement("details");
      details.classList.add("child-menu");

      const summary = document.createElement("summary");
      summary.classList.add("nav-summary");

      const a = document.createElement("a");
      a.href = page.fullPath;
      a.textContent = page.title;
      summary.appendChild(a);

      details.appendChild(summary);

      // Rekursiv Kinder rendern
      const childrenUl = renderTree(page.children);
      if (childrenUl) {
        details.appendChild(childrenUl);
      }

      li.appendChild(details);
    } else {
      // Keine Kinder: Einfacher Link
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
  nav.appendChild(menu || document.createTextNode("Keine Seiten verfügbar"));
  return nav;
}
