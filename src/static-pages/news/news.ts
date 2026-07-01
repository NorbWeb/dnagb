import { Component } from "../../utils/base-component";
import html from "./news.html?raw";
import styles from "./news.css?inline";
import "../../components/news-card/news-card";
import "../../components/button/button";
import { feedStore } from "../../store/combined-feed.store";
import { renderNewsCard } from "../../renderer/card.render";

class News extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
    this.watch(feedStore._allContent);
    this.watch(feedStore._filter);
  }

  connectedCallback() {
    // Füge dem Host-Element eine Klasse hinzu
    super.connectedCallback();
    this.classList.add("container-width");
  }

  render() {
    const container = this.shadowRoot?.querySelector(".news-content");
    if (!container) return;
    container.innerHTML = "";

    for (const element of feedStore.filteredContent) {
      const card = renderNewsCard(element);
      container.appendChild(card);
    }

    this.shadowRoot?.querySelectorAll("app-button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        if (filter) feedStore.setFilter(filter);
      });
    });
  }
}

if (!customElements.get("app-news")) {
  customElements.define("app-news", News);
}
