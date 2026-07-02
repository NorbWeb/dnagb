import { type Page } from "../types/page";
import { type StaticPage } from "../types/staticPage";
import { icon } from "../utils/icon";

interface NavOptions {
  items: (Page | StaticPage)[];
  canGoBack: boolean;
  hasChildren: (pageId: string) => boolean;
  onNavigate: (pageId: string) => void;
  onBack: () => void;
}

export function renderNavMenu(options: NavOptions): HTMLElement {
  const { items, canGoBack, hasChildren, onNavigate, onBack } = options;
  const nav = document.createElement("nav");
  nav.classList.add("side-nav");

  if (canGoBack) {
    const header = document.createElement("div");
    header.classList.add("nav-header");

    const backBtn = document.createElement("button");
    backBtn.classList.add("nav-back-btn");
    backBtn.appendChild(icon("arrow-back"));
    backBtn.appendChild(document.createTextNode(" Zurück"));
    backBtn.onclick = onBack;

    header.appendChild(backBtn);
    nav.appendChild(header);
  }

  const ul = document.createElement("ul");
  ul.classList.add("nav-list");

  items.forEach((page) => {
    const li = document.createElement("li");
    li.classList.add("nav-item");

    const a = document.createElement("a");
    a.href = page.fullPath || "#";
    a.textContent = page.title;
    li.appendChild(a);

    // Fragt direkt die übergebene Funktion, ob es Kinder gibt
    if (hasChildren(page.id)) {
      const trigger = document.createElement("span");
      trigger.classList.add("menu-trigger");
      trigger.appendChild(icon("chevron-right"));

      trigger.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onNavigate(page.id);
      };

      li.appendChild(trigger);
    }

    ul.appendChild(li);
  });

  nav.appendChild(ul);
  return nav;
}
