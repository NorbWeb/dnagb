// import { type Page } from "../types/page";
// import { icon } from "../utils/icon";

// function renderTree(pages: Page[]): HTMLElement | null {
//   if (!pages?.length) return null;

//   const ul = document.createElement("ul");
//   ul.classList.add("nav-list");

//   for (const page of pages) {
//     if (page.link_location !== "menu") continue;

//     const li = document.createElement("li");
//     li.classList.add("nav-item");

//     // 1. Der Link (Immer vorhanden)
//     const a = document.createElement("a");
//     a.href = page.fullPath;
//     a.textContent = page.title;
//     li.appendChild(a);

//     // 2. Falls Kinder: Trigger und Container
//     if (page.children?.length > 0) {
//       const trigger = document.createElement("span");
//       trigger.classList.add("menu-trigger");
//       trigger.appendChild(icon("arrow-drop-down"));

//       trigger.addEventListener("click", (e) => {
//         e.stopPropagation();

//         // 1. Ist das aktuelle Element bereits offen?
//         const isOpening = !li.hasAttribute("open");

//         // 2. Schließe ALLE .nav-item Elemente in diesem gesamten Baum
//         const allItems = ul.querySelectorAll(".nav-item");
//         allItems.forEach((item) => {
//           item.removeAttribute("open");
//           const t = item.querySelector(".menu-trigger > svg");
//           if (t) {
//             t.replaceWith(icon("arrow-drop-down"));
//           }
//         });

//         // 3. Wenn es zu war, jetzt öffnen
//         if (isOpening) {
//           li.setAttribute("open", "");
//           const t = li.querySelector(".menu-trigger > svg");
//           if (t) {
//             t.replaceWith(icon("arrow-drop-up"));
//           }
//         }
//       });

//       li.appendChild(trigger);

//       const childMenu = document.createElement("div");
//       childMenu.classList.add("child-menu");

//       const childrenUl = renderTree(page.children);
//       if (childrenUl) {
//         childMenu.appendChild(childrenUl);
//       }
//       li.appendChild(childMenu);
//     }
//     ul.appendChild(li);
//   }
//   return ul;
// }

// export function renderNavMenu(pages: Page[]) {
//   const menu = renderTree(pages);
//   const nav = document.createElement("nav");
//   nav.classList.add("main-nav");
//   nav.appendChild(menu || document.createTextNode(""));

//   // Zentrale Logik zum Zurücksetzen
//   const closeAllMenus = () => {
//     const allItems = nav.querySelectorAll(".nav-item[open]");
//     allItems.forEach((item) => {
//       item.removeAttribute("open");
//       const trigger = item.querySelector(".menu-trigger > svg");
//       if (trigger) trigger.replaceWith(icon("arrow-drop-down"));
//     });
//   };

//   // 1. Klicks innerhalb der Nav (Delegation)
//   nav.addEventListener("click", (e) => {
//     const target = e.target as HTMLElement;

//     // Wenn ein Link geklickt wird, alle Menüs schließen
//     if (target.tagName === "A") {
//       closeAllMenus();
//     }
//   });

//   // 2. Globaler Klick auf das Dokument
//   document.addEventListener("click", (e) => {
//     // Wenn der Klick NICHT innerhalb der Navigation stattfand, alles schließen
//     if (!nav.contains(e.target as Node)) {
//       closeAllMenus();
//     }
//   });

//   return nav;
// }

import { type Page } from "../types/page";
import { icon } from "../utils/icon";

// Interface für die Steuerung der Navigation
interface NavOptions {
  items: Page[];
  canGoBack: boolean;
  onNavigate: (pageId: string) => void;
  onBack: () => void;
}

export function renderNavMenu(options: NavOptions): HTMLElement {
  const { items, canGoBack, onNavigate, onBack } = options;
  const nav = document.createElement("nav");
  nav.classList.add("side-nav");

  // 1. Header (Back-Button)
  if (canGoBack) {
    const header = document.createElement("div");
    header.classList.add("nav-header");
    const backBtn = document.createElement("button");
    backBtn.innerHTML = `${icon("arrow-back").outerHTML} Zurück`;
    backBtn.onclick = onBack;
    header.appendChild(backBtn);
    nav.appendChild(header);
  }

  // 2. Liste
  const ul = document.createElement("ul");
  ul.classList.add("nav-list");

  items.forEach((page) => {
    const li = document.createElement("li");
    li.classList.add("nav-item");

    const a = document.createElement("a");
    a.href = page.fullPath;
    a.textContent = page.title;
    li.appendChild(a);

    // Trigger-Bereich (Hier rufen wir den Callback auf)
    if (page.children?.length > 0) {
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
