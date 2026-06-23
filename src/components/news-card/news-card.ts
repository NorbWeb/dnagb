import { Component } from "../../utils/base-component";
import html from "./news-card.html?raw";
import styles from "./news-card.css?inline";

class NewsCard extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
  }

  render() {}
}

if (!customElements.get("app-news-card")) {
  customElements.define("app-news-card", NewsCard);
}
