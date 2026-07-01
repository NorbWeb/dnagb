import { Component } from "../../utils/base-component";
import html from "./home.html?raw";
import styles from "./home.css?inline";
import { feedStore } from "../../store/combined-feed.store";
import { renderNewsCard } from "../../renderer/card.render";
import "../../components/news-card/news-card";
import { formatDateRange } from "../../utils/helper";

class Home extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
    this.watch(feedStore._allContent);
  }

  connectedCallback() {
    // Füge dem Host-Element eine Klasse hinzu
    super.connectedCallback();
    this.classList.add("full-width");
  }

  render() {
    const container = this.shadowRoot?.getElementById("info");
    if (!container) return;
    container.innerHTML = "";

    // event list
    let listContainer = document.createElement("div");
    listContainer.classList.add("list-card");
    let title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = "Anstehende Events";
    listContainer.appendChild(title);

    let eventList = document.createElement("ul");
    eventList.classList.add("event-list");
    if (feedStore.futureEvents.length < 1) {
      const li = document.createElement("li");
      li.textContent = "Es stehen gerade keine Events an.";
      eventList.appendChild(li);
    } else {
      for (const event of feedStore.futureEvents) {
        const li = document.createElement("li");
        li.textContent =
          formatDateRange(event.date_start, null, false) + " | " + event.title;

        eventList.appendChild(li);
      }
    }
    listContainer.appendChild(eventList);
    container.appendChild(listContainer);

    for (const element of feedStore.lastNews) {
      const card = renderNewsCard(element);
      container.appendChild(card);
    }
  }
}

if (!customElements.get("app-home")) {
  customElements.define("app-home", Home);
}
