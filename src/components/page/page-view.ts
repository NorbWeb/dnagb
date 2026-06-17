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

    let title = page.show_title ? `<h1>${page.title}</h1>` : "";

    // Hier rendern wir das "Template" der Seite
    this.innerHTML = `
      <article>
      <div class="content">
        ${title}
        ${page.content || "Ich bin leer, bitte gib mir Worte!"}</div>
      </article>
    `;
  }
}
if (!customElements.get("page-view")) {
  customElements.define("page-view", PageView);
}
