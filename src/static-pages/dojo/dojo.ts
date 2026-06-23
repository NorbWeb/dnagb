import { Component } from "../../utils/base-component";
import html from "./dojo.html?raw";
import styles from "./dojo.css?inline";

class Dojo extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
  }

  render() {}
}

if (!customElements.get("app-dojo")) {
  customElements.define("app-dojo", Dojo);
}
