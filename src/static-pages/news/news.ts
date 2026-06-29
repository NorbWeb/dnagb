import { Component } from "../../utils/base-component";
import html from "./news.html?raw";
import styles from "./news.css?inline";
import { eventStore } from "../../store/event.store";
import { newsStore } from "../../store/news.store";
import "../../components/news-card/news-card";
import { sortByDate } from "../../utils/helper";

class News extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
    this.watch(newsStore._news);
    this.watch(eventStore._events);
  }

  render() {
    const events = eventStore.events;
    const news = newsStore.news;

    const allItems = [...events, ...news];

    sortByDate(allItems);
    console.log(`📢 ~ News ~ allItems:`, allItems);

    const container = this.shadowRoot?.getElementById("news-container");
    if (!container) return;
    container.innerHTML = "";

    for (const element of allItems) {
      let card = document.createElement("app-news-card");
      card.setAttribute("title", element.title);
      card.setAttribute("date", element.date_start);
      card.setAttribute("teaser", element.announcement);
      card.setAttribute("link-url", `/events/${element.id}`);
      container.appendChild(card);
    }
  }
}

if (!customElements.get("app-news")) {
  customElements.define("app-news", News);
}
