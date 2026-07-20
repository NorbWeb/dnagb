import { Component } from "../utils/base-component";
import html from "./details-page.html?raw";
import styles from "./details-page.css?inline";
import { renderBlock } from "../renderer/block.renderer";
import { feedStore } from "../store/combined-feed.store";
import { formatDateRange } from "../utils/helper";

class DetailsPage extends Component {
  static html = html;
  static styles = styles;
  static get observedAttributes() {
    return ["type", "id"];
  }

  constructor() {
    super();
    this.watch(feedStore._allContent, () => {
      this.render();
    });
  }

  render() {
    const article = this.shadowRoot?.getElementById("dynamic-content");
    if (!article) return;
    article.innerHTML = "";

    const type = this.getAttribute("type");
    const id = this.getAttribute("id");

    const data = feedStore.filterById(id, type);

    if (data) {
      // title
      let title = document.createElement(`h1`);
      title.textContent = data.title;
      article.appendChild(title);

      // info
      let info = document.createElement("div");
      info.classList.add("info");
      article.appendChild(info);

      // date
      let date = document.createElement("span");
      date.textContent = `${formatDateRange(data.date_start, data.date_end, data.fe_type === "event")}${"author" in data ? ", " + data.author : ""}`;
      date.classList.add("date");
      info.appendChild(date);

      // event category
      if (data.fe_type === "event" && "category" in data) {
        let categories = document.createElement("div");
        categories.classList.add("category");

        if (data.category) {
          for (const element of data.category) {
            let chip = document.createElement("span");
            chip.textContent = element;
            chip.classList.add("chip");
            categories.appendChild(chip);
          }
          info.appendChild(categories);
        }
      }

      // content blocks
      if (data.details) {
        for (const block of data?.details?.blocks) {
          article.appendChild(renderBlock(block, null));
        }
      } else {
        let p = document.createElement("p");
        p.textContent = "Diese Seite hat noch keinen Inhalt.";
        article.appendChild(p);
      }
    }
  }
}

if (!customElements.get("app-details-page")) {
  customElements.define("app-details-page", DetailsPage);
}
