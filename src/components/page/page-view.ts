// components/page/page-view.ts
import { pageStore } from "../../store/page.store";

class PageView extends HTMLElement {
  static get observedAttributes() {
    return ["path"];
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (name === "path" && oldVal !== newVal) {
      this.render();
    }
  }

  render() {
    const path = this.getAttribute("path");
    const page = pageStore.pages.find((p) => p.fullPath === path);

    if (!page) {
      this.innerHTML = `<h1>404 - Seite nicht gefunden</h1>`;
      return;
    }

    // Hier rendern wir das "Template" der Seite
    this.innerHTML = `
      <article>
        <h1>${page.title || "Titel"}</h1>
        <div class="content">${page.content || "Inhalt"}</div>
      </article>
    `;
  }
}
if (!customElements.get("page-view")) {
  customElements.define("page-view", PageView);
}
