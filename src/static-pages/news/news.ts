import { Component } from "../../utils/base-component";
import html from "./news.html?raw";
import styles from "./news.css?inline";
import "../../components/news-card/news-card";
import { feedStore } from "../../store/combined-feed.store";

class News extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
    this.watch(feedStore._allContent);
  }

  render() {
    const feed = feedStore.allContent;

    const container = this.shadowRoot?.getElementById("news-container");
    if (!container) return;
    container.innerHTML = "";

    for (const element of feed) {
      let card = document.createElement("app-news-card");
      card.setAttribute(
        "image-src",
        element.image
          ? `${import.meta.env.VITE_CMS_URL}/assets/${element.image}`
          : "/assets/placeholder.jpg",
      );
      card.setAttribute("title", element.title);
      card.setAttribute(
        "date",
        new Date(element.date_start).toLocaleDateString(),
      );
      card.setAttribute("teaser", element.announcement);
      card.setAttribute("link-url", `/events/${element.id}`);
      container.appendChild(card);
    }
  }
}

if (!customElements.get("app-news")) {
  customElements.define("app-news", News);
}
