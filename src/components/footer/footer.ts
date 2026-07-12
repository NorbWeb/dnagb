import { Component } from "../../utils/base-component";
import html from "./footer.html?raw";
import styles from "./footer.css?inline";
import { pageStore } from "../../store/page.store";

class Footer extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
    this.watch(pageStore._footerLinks);
  }

  render() {
    const footer = this.shadowRoot?.querySelector("#footer");
    const navBar = document.createElement("nav");

    if (footer) {
      footer.innerHTML = "";
      for (const page of pageStore.footerLinks.value) {
        const anchor = document.createElement("a");
        anchor.textContent = page.title;
        anchor.href = page.fullPath;
        navBar.appendChild(anchor);
      }
      footer.appendChild(navBar);
    }
  }
}

if (!customElements.get("app-footer")) {
  customElements.define("app-footer", Footer);
}
