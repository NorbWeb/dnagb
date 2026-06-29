import { Component } from "../../utils/base-component";
import html from "./news-card.html?raw";
import styles from "./news-card.css?inline";

class NewsCard extends Component {
  static html = html;
  static styles = styles;
  static get watchedAttributes() {
    return ["title", "date", "teaser", "image-src", "link-url", "img-alt"];
  }

  constructor() {
    super();
  }

  render() {
    const attrImgSrc = this.getAttribute("image-src") || "";
    const attrImgAlt = this.getAttribute("img-alt") || "Bild";

    const attrTitle = this.getAttribute("title") || "Titel";
    const attrTeaser = this.getAttribute("teaser") || "Teaser";
    const attrDate = this.getAttribute("date") || "Date";

    const attrLink = this.getAttribute("link-url") || "#";
    const attrLinkText = this.getAttribute("link-text") || "Mehr";

    const img = this.shadowRoot?.querySelector(".image");
    if (img) {
      img.setAttribute("src", attrImgSrc);
      img.setAttribute("alt", attrImgAlt);
    }

    const title = this.shadowRoot?.querySelector(".title");
    if (title) {
      title.textContent = attrTitle;
    }

    const date = this.shadowRoot?.querySelector(".date");
    if (date) {
      date.textContent = attrDate;
    }

    const teaser = this.shadowRoot?.querySelector(".teaser");
    if (teaser) {
      teaser.textContent = attrTeaser;
    }

    const a = this.shadowRoot?.querySelector("a");
    if (a) {
      a.setAttribute("href", attrLink);
      a.textContent = attrLinkText;
    }
  }
}

if (!customElements.get("app-news-card")) {
  customElements.define("app-news-card", NewsCard);
}
