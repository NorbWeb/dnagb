import { Component } from "../../utils/base-component";
import html from "./news.html?raw";
import styles from "./news.css?inline";

class News extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
  }

  render() {}
}

if (!customElements.get("app-news")) {
  customElements.define("app-news", News);
}
