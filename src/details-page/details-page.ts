import { Component } from "../utils/base-component";
import html from "./details-page.html?raw";
import styles from "./details-page.css?inline";
import { newsStore } from "../store/news.store";
import { eventStore } from "../store/event.store";
import { renderBlock } from "../renderer/block.renderer";

class DetailsPage extends Component {
  static html = html;
  static styles = styles;
  static get observedAttributes() {
    return ["type", "id"];
  }
  pathname = window.location.pathname;
  parts = this.pathname.split("/"); // ["", "event", "123"]
  type = this.parts[1]; // "event" oder "news"
  id = this.parts[2]; // "123"

  constructor() {
    super();
  }

  render() {
    console.log("🐦‍⬛ ~ DetailsPage ~ render ~ this.type:", this.type);
    console.log("🐦‍⬛ ~ DetailsPage ~ render ~ this.id:", this.id);
    const article = this.shadowRoot?.getElementById("details-content");
    if (!article) return;
    article.innerHTML = "";

    const data =
      this.type === "event"
        ? eventStore.byId(this.id)
        : newsStore.byId(this.id);
    // console.log("🐦‍⬛ ~ DetailsPage ~ render ~ data:", data);
    for (const block of data?.description.blocks) {
      article.appendChild(renderBlock(block, null));
    }
  }
}

if (!customElements.get("app-details-page")) {
  customElements.define("app-details-page", DetailsPage);
}
