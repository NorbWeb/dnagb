// components/nav/app-nav.ts
import { pageStore } from "../../store/page.store";

class AppNav extends HTMLElement {
  connectedCallback() {
    // 1. Sofort rendern, falls Daten im Cache (verhindert Flimmern)
    // if (sessionStorage.getItem("nav_tree")) {
    //   this.render();
    // }

    // 2. Daten laden (im Hintergrund aktualisieren)
    pageStore.fetchPages().then(() => this.render());

    // 3. Auf Klicks lauschen, um SPA-Navigation statt Reloads zu nutzen
    this.addEventListener("click", this.handleNavigation);
  }

  private handleNavigation(e: Event) {
    const target = (e.target as HTMLElement).closest("a");
    if (target) {
      e.preventDefault();
      const path = target.getAttribute("href");
      if (path) {
        // Nutze die Navigation API für den SPA-Wechsel
        navigation.navigate(path);
      }
    }
  }

  private renderTree(pages: any[]): string {
    if (!pages || pages.length === 0) return "";
    return `
      <ul>
        ${pages
          .map(
            (page) => `
          <li>
            <a href="${page.fullPath || page.id}">${page.title}</a>
            ${this.renderTree(page.children)}
          </li>
        `,
          )
          .join("")}
      </ul>
    `;
  }

  render() {
    const pages = pageStore.pageTree || [];
    this.innerHTML = `
      <nav>
        ${this.renderTree(pages)}
      </nav>
      <style>
        nav ul { list-style: none; padding-left: 1rem; }
        nav li { margin: 0.5rem 0; }
        nav a { text-decoration: none; color: inherit; display: block; }
        nav a:hover { color: blue; }
      </style>
    `;
  }
}

if (!customElements.get("app-nav")) {
  customElements.define("app-nav", AppNav);
}

export default AppNav;
