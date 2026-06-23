// components/page/page-view.ts
import { pageStore } from "../store/page.store";
import { renderBlock } from "../renderer/block.renderer";
import { Component } from "../utils/base-component";

class PageView extends Component {
  // static get observedAttributes() {
  //   return ["path"];
  // }

  render() {
    const root = this.shadowRoot!;
    const path = this.getAttribute("path");
    const page = pageStore.findByPath(path || "");

    if (!page) {
      root.innerHTML = `Seite konnte nicht geladen werden`;
      return;
    }

    root.innerHTML = "";
    const article = document.createElement("article");

    if (page.show_titel === "true") {
      let title = document.createElement(`h1`);
      title.textContent = page.title;
      article.appendChild(title);
    }

    if (page.content_radio_switch === "text_editor") {
      article.innerHTML += page.text_editor
        ? page.text_editor
        : `Die Seite „${page.title}“ hat noch keinen Inhalt.`;
    }

    if (
      page.content_radio_switch === "block_editor" &&
      page.block_editor?.blocks
    ) {
      for (const block of page.block_editor.blocks) {
        article.appendChild(renderBlock(block));
      }
    }

    root.appendChild(article);
  }
}

if (!customElements.get("page-view")) {
  customElements.define("page-view", PageView);
}
