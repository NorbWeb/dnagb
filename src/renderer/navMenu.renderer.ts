import { type Page } from "../types/page";
import { type StaticPage } from "../types/staticPage";
import { icon } from "../utils/icon";

interface NavOptions {
  items: (Page | StaticPage)[];
  canGoBack: boolean;
  parentTitle: string;
  hasChildren: (pageId: string) => boolean;
  onNavigate: (pageId: string) => void;
  onBack: () => void;
}

export function renderNavMenu(options: NavOptions): HTMLElement {
  const { items, canGoBack, parentTitle, hasChildren, onNavigate, onBack } =
    options;
  const ul = document.createElement("ul");
  ul.classList.add("nav-list");

  if (canGoBack) {
    const liBack = document.createElement("li");
    liBack.classList.add("nav-item", "nav-item-back");

    liBack.appendChild(icon("chevron-right"));
    liBack.appendChild(document.createTextNode(parentTitle));

    liBack.onclick = onBack;

    ul.appendChild(liBack);
  }

  items.forEach((page) => {
    const li = document.createElement("li");
    li.classList.add("nav-item");

    const a = document.createElement("a");
    a.href = page.fullPath || "#";
    a.textContent = page.title;

    a.onclick = () => {
      const dialog = a.closest("dialog") as HTMLDialogElement | null;
      if (dialog) {
        dialog.close();
      }
    };

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

  return ul;
}
