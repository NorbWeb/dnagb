// components/nav/app-nav.ts
import { pageStore } from "../../store/page.store";

class AppNav extends HTMLElement {
  connectedCallback() {
    // Initial laden
    pageStore.fetchPages().then(() => this.render());
  }

  render() {
    const pages = pageStore.pageTree;
    this.innerHTML = `
      <nav>
        ${pages
          .map(
            (page) => `
          <a href="/${page.slug}">${page.title}</a>
          ${page.children.length > 0 ? `<ul>... submenus ...</ul>` : ""}
        `,
          )
          .join("")}
      </nav>
    `;
  }
}
if (!customElements.get("app-nav")) {
  customElements.define("app-nav", AppNav);
}

export default AppNav;
