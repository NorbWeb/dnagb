import { pageStore } from "../../store/page.store";
import { renderNavMenu } from "../../renderer/navMenu.renderer";
import styles from "./app-nav.css?inline";
import { Component } from "../../utils/base-component";
import navHtml from "./app-nav.html?raw";

class AppNav extends Component {
  static html = navHtml;
  static styles = styles;

  private currentParentId: string | null = null;
  private history: (string | null)[] = [];

  constructor() {
    super();
    this.watch(pageStore.pages);
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  render() {
    const container = this.shadowRoot?.getElementById("side-nav");
    if (!container) return;

    container.innerHTML = "";

    const items = pageStore.getChildren(this.currentParentId);

    const menu = renderNavMenu({
      items: items,
      canGoBack: this.history.length > 0,

      hasChildren: (id) => pageStore.hasChildren(id),

      onNavigate: (id) => {
        this.history.push(this.currentParentId);
        this.currentParentId = id;
        this.render();
      },
      onBack: () => {
        const previousId = this.history.pop();
        this.currentParentId = previousId !== undefined ? previousId : null;
        this.render();
      },
    });

    container.appendChild(menu);
  }
}

if (!customElements.get("app-nav")) {
  customElements.define("app-nav", AppNav);
}

export default AppNav;
