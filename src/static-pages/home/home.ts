import { Component } from "../../utils/base-component";
import html from "./home.html?raw";
import styles from "./home.css?inline";
import { feedStore } from "../../store/combined-feed.store";
import { renderNewsCard } from "../../renderer/card.render";
import "../../components/news-card/news-card";
import { formatDateRange } from "../../utils/helper";
import { pageStore } from "../../store/page.store";
import { settingsStore } from "../../store/settings.store";

class Home extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
    this.watch(feedStore._allContent);
    this.watch(pageStore._pages);
    this.watch(settingsStore._settings);
  }

  navigate(url: string) {
    navigation.navigate(url);
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("full-width");

    const btnGroup = this.shadowRoot?.querySelector(".button-group");
    if (btnGroup) {
      const navBtn = pageStore.getHomeNavButtons();

      for (const element of navBtn) {
        const button = document.createElement("app-button");
        button.textContent = element.title;
        button.addEventListener("click", () => {
          navigation.navigate(element.fullPath);
        });

        btnGroup.appendChild(button);
      }
    }

    const title = this.shadowRoot?.querySelector("h1.title");
    if (title && settingsStore.settings) {
      title.innerHTML = settingsStore.settings?.title_long_1.replaceAll(
        "|",
        "</br>",
      );
    }

    const banner = this.shadowRoot?.querySelector(
      "#banner",
    ) as HTMLImageElement;
    if (banner && settingsStore.settings?.banner) {
      banner.src = `${import.meta.env.VITE_CMS_URL}/assets/${settingsStore.settings?.banner}`;
    } else {
      banner.src = "/assets/placeholder.jpg";
    }
  }

  render() {
    const container = this.shadowRoot?.querySelector(".info-content");
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
        const icon = document.createElement("span");
        icon.classList.add("icon");
        li.appendChild(icon);
        const text = document.createElement("span");
        text.classList.add("text");
        text.textContent =
          formatDateRange(event.date_start, null, false) + " | " + event.title;
        li.appendChild(text);
        li.addEventListener("click", () => {
          navigation.navigate(`/event/${event.id}`);
        });
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
