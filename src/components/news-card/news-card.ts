import { Component } from "../../utils/base-component";
import html from "./news-card.html?raw";
import styles from "./news-card.css?inline";
import { icon } from "../../utils/icon";

class NewsCard extends Component {
  static html = html;
  static styles = styles;
  static get watchedAttributes() {
    return [
      "title",
      "date",
      "teaser",
      "type",
      "image-src",
      "link-url",
      "img-alt",
      "is-past",
    ];
  }

  constructor() {
    super();

    const fakeLink = this.shadowRoot?.querySelector(".fake-link");
    if (fakeLink) {
      fakeLink.appendChild(icon("arrow-right"));
    }
  }

  render() {
    const attrIsPast = this.getAttribute("is-past") || "false";

    const attrLink = this.getAttribute("link-url") || "#";

    const attrImgSrc = this.getAttribute("image-src") || "";
    const attrImgAlt = this.getAttribute("img-alt") || "Bild";

    const attrTitle = this.getAttribute("title") || "Titel";
    const attrTeaser = this.getAttribute("teaser") || "";
    const attrDate = this.getAttribute("date") || "Date";
    const attrType = this.getAttribute("type") || null;

    const card = this.shadowRoot?.querySelector(".card");
    if (card && attrIsPast === "true") {
      card.classList.add("is-past");
    }

    const a = this.shadowRoot?.querySelector("a");
    if (a) {
      a.setAttribute("href", attrLink);
    }

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

    const type = this.shadowRoot?.querySelector(".type");

    if (type && attrType) {
      type.innerHTML = "";
      type.classList.add("show");
      for (const item of attrType.split(",")) {
        let span = document.createElement("span");
        span.classList.add("chip");
        span.innerText = item;
        type.appendChild(span);
      }
    }

    const teaser = this.shadowRoot?.querySelector(".teaser");
    if (teaser && attrTeaser !== "") {
      teaser.textContent = attrTeaser;
      teaser.classList.remove("empty");
    } else {
      teaser?.classList.add("empty");
    }
  }
}

if (!customElements.get("app-news-card")) {
  customElements.define("app-news-card", NewsCard);
}
