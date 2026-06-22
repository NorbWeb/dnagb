// components/page/page-view.ts
import { pageStore } from "../../store/page.store";
import { renderBlock } from "../../renderer/block.renderer";

class PageView extends HTMLElement {
  static get observedAttributes() {
    return ["path"];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const path = this.getAttribute("path");
    const page = pageStore.findByPath(path || "");

    if (!page) {
      this.innerHTML = `<h1>404 - Seite nicht gefunden</h1>`;
      return;
    }

    this.innerHTML = "";
    const article = document.createElement("article");

    if (page.show_title === "true") {
      let title = document.createElement(`h1`);
      title.textContent = page.title;
      article.appendChild(title);
    }

    if (page.content_radio_switch === "text_editor") {
      article.innerHTML += page.text_editor ? page.text_editor : "Ohne Inhalt";
    }

    if (
      page.content_radio_switch === "block_editor" &&
      page.block_editor?.blocks
    ) {
      for (const block of page.block_editor.blocks) {
        article.appendChild(renderBlock(block));
      }
    }

    this.appendChild(article);
  }
}

if (!customElements.get("page-view")) {
  customElements.define("page-view", PageView);
}
