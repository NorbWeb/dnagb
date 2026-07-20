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

    const filterBar = this.shadowRoot?.getElementById("filter-bar");
    const allFilter = filterBar?.querySelector("#all-filter");

    filterBar?.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement) {
        console.log(target.value);
        if (target.value === feedStore.filter) {
          feedStore.setFilter("all");
          if (allFilter && allFilter instanceof HTMLInputElement)
            allFilter.checked = true;
        } else {
          feedStore.setFilter(target.value);
        }
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("full-width");
  }

  render() {
    const container = this.shadowRoot?.querySelector(".news-content");
    if (!container) return;
    container.innerHTML = "";

    for (const element of feedStore.filteredContent) {
      const card = renderNewsCard(element);
      container.appendChild(card);
    }
  }
}

if (!customElements.get("app-news")) {
  customElements.define("app-news", News);
}
