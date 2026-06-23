// components/nav/app-nav.ts
import { pageStore } from "../../store/page.store";
import { renderNavMenu } from "../../renderer/navMenu.renderer";
import styles from "./app-nav.css?inline";
import { Component } from "../../utils/base-component";
import navHtml from "./app-nav.html?raw";

class AppNav extends Component {
  static html = navHtml;
  static styles = styles;
  constructor() {
    super();
    this.watch(pageStore.pageTree);
  }

  render() {
    const pages = pageStore.pageTree.value || [];

    const container = this.shadowRoot?.getElementById("nav-container");
    if (!container) return;
    container.innerHTML = "";
    container.appendChild(renderNavMenu(pages));
  }
}

if (!customElements.get("app-nav")) {
  customElements.define("app-nav", AppNav);
}

export default AppNav;
