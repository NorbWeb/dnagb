import { Component } from "../../utils/base-component";
import html from "./button.html?raw";
import styles from "./button.css?inline";

class Button extends Component {
  static html = html;
  static styles = styles;
  static get watchedAttributes() {
    return ["wcClass"];
  }

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
    const wcClasses = this.getAttribute("wcClass");
    const rootButton = this.shadowRoot?.querySelector(".btn");
    if (rootButton && wcClasses) {
      rootButton.classList.add(...wcClasses.split(" "));
    }
  }

  render() {}
}

if (!customElements.get("app-button")) {
  customElements.define("app-button", Button);
}
