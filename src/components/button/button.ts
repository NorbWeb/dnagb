import { Component } from "../../utils/base-component";
import html from "./button.html?raw";
import styles from "./button.css?inline";

class Button extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
  }

  render() {}
}

if (!customElements.get("app-button")) {
  customElements.define("app-button", Button);
}
