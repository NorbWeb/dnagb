import { Component } from "../utils/base-component";
import html from "./details-page.html?raw";
import styles from "./details-page.css?inline";
import { renderBlock } from "../renderer/block.renderer";
import { feedStore } from "../store/combined-feed.store";

class DetailsPage extends Component {
  static html = html;
  static styles = styles;
  static get observedAttributes() {
    return ["type", "id"];
  }

  constructor() {
    super();
    this.watch(feedStore._allContent);
  }

  render() {
    const article = this.shadowRoot?.getElementById("details-content");
    if (!article) return;
    article.innerHTML = "";

    const type = this.getAttribute("type");
    const id = this.getAttribute("id");

    const data = feedStore.filterById(id, type);

    if (data && data.description) {
      for (const block of data?.description?.blocks) {
        article.appendChild(renderBlock(block, null));
      }
    } else {
      let p = document.createElement("p");
      p.textContent = "Diese Seite hat noch keinen Inhalt.";
      article.appendChild(p);
    }
  }
}

if (!customElements.get("app-details-page")) {
  customElements.define("app-details-page", DetailsPage);
}
