// components/page/page-view.ts
import { pageStore } from "../store/page.store";
import { renderBlock } from "../renderer/block.renderer";
import { modifiedTextEditor } from "../renderer/textEditor.renderer";
import { Component } from "../utils/base-component";
import contentHtml from "./cms-page-view.html?raw";
import styles from "./cms-page-view.css?inline";

class PageView extends Component {
  static html = contentHtml;
  static styles = styles;
  // static get observedAttributes() {
  //   return ["path"];
  // }

  render() {
    const path = this.getAttribute("path");
    const page = pageStore.findByPath(path || "");

    const article = this.shadowRoot?.getElementById("dynamic-content");
    if (!article) return;

    if (!page) {
      article.innerHTML = `<p>Seite konnte nicht geladen werden</p>`;
      return;
    }

    article.innerHTML = "";

    if ("show_titel" in page && page.show_titel === "true") {
      let title = document.createElement(`h1`);
      title.textContent = page.title;
      article.appendChild(title);
    }

    if (
      "content_radio_switch" in page &&
      page.content_radio_switch === "text_editor"
    ) {
      article.innerHTML += page.text_editor
        ? modifiedTextEditor(page)
        : `<p>Die Seite „${page.title}“ hat noch keinen Inhalt.</p>`;
    }

    if (
      "content_radio_switch" in page &&
      "block_editor" in page &&
      page.content_radio_switch === "block_editor" &&
      page.block_editor?.blocks
    ) {
      for (const block of page.block_editor.blocks) {
        article.appendChild(renderBlock(block, page));
      }
    }
  }
}

if (!customElements.get("page-view")) {
  customElements.define("page-view", PageView);
}
