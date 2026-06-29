import { Component } from "../../utils/base-component";
import html from "./home.html?raw";
import styles from "./home.css?inline";

class Home extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
  }

  connectedCallback() {
    // Füge dem Host-Element eine Klasse hinzu
    this.classList.add("full-width");
  }

  render() {}
}

if (!customElements.get("app-home")) {
  customElements.define("app-home", Home);
}
