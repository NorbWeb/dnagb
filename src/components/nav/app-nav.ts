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
    this.watch(pageStore.pages);
  }

  render() {
    const container = this.shadowRoot?.getElementById("nav-container");
    if (!container) return;
    container.innerHTML = "";

    // 1. Daten holen
    const items = pageStore.getChildren(this.currentParentId);

    // 2. Renderer aufrufen
    const menu = renderNavMenu({
      items: items,
      canGoBack: this.history.length > 0,
      onNavigate: (id) => {
        this.history.push(this.currentParentId);
        this.currentParentId = id;
        this.render(); // Erzwingt komplettes Re-Render
      },
      onBack: () => {
        this.currentParentId = this.history.pop() || null;
        this.render(); // Erzwingt komplettes Re-Render
      },
    });

    container.appendChild(menu);
  }
}

if (!customElements.get("app-nav")) {
  customElements.define("app-nav", AppNav);
}

export default AppNav;
