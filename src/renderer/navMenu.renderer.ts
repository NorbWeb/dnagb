import { type Page } from "../types/page";

function renderTree(pages: Page[]): HTMLElement | null {
  if (!pages?.length) return null;

  const ul = document.createElement("ul");
  ul.classList.add("nav-list");

  for (const page of pages) {
    if (page.link_location !== "menu") continue;

    const li = document.createElement("li");
    li.classList.add("nav-item");

    // 1. Der Link (Immer vorhanden)
    const a = document.createElement("a");
    a.href = page.fullPath;
    a.textContent = page.title;
    li.appendChild(a);

    // 2. Falls Kinder: Trigger und Container
    if (page.children?.length > 0) {
      const trigger = document.createElement("span");
      trigger.classList.add("menu-trigger");
      trigger.textContent = "↓";

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();

        // 1. Ist das aktuelle Element bereits offen?
        const isOpening = !li.hasAttribute("open");

        // 2. Schließe ALLE .nav-item Elemente in diesem gesamten Baum
        const allItems = ul.querySelectorAll(".nav-item");
        allItems.forEach((item) => {
          item.removeAttribute("open");
          const t = item.querySelector(".menu-trigger");
          if (t) t.textContent = "↓";
        });

        // 3. Wenn es zu war, jetzt öffnen
        if (isOpening) {
          li.setAttribute("open", "");
          trigger.textContent = "↑";
        }
      });

      li.appendChild(trigger);

      const childMenu = document.createElement("div");
      childMenu.classList.add("child-menu");

      const childrenUl = renderTree(page.children);
      if (childrenUl) {
        childMenu.appendChild(childrenUl);
      }
      li.appendChild(childMenu);
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

  // Event Delegation am Nav-Container
  nav.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    // Wenn ein Link geklickt wurde:
    if (target.tagName === "A") {
      const allItems = nav.querySelectorAll(".nav-item");
      allItems.forEach((item) => {
        item.removeAttribute("open");
        const trigger = item.querySelector(".menu-trigger");
        if (trigger) trigger.textContent = "↓";
      });
    }
  });

  return nav;
}
