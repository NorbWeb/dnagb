import { pageStore } from "../../store/page.store";
import { renderNavMenu } from "../../renderer/navMenu.renderer";
import styles from "./app-nav.css?inline";
import { Component } from "../../utils/base-component";
import navHtml from "./app-nav.html?raw";
import { icon } from "../../utils/icon";

class AppNav extends Component {
  static html = navHtml;
  static styles = styles;

  private currentParentId: string | null = null;
  private history: (string | null)[] = [];

  constructor() {
    super();
    this.watch(pageStore.pages);
  }

  public open() {
    const dialog = this.shadowRoot?.getElementById(
      "side-nav",
    ) as HTMLDialogElement | null;
    if (!dialog) return;

    this.currentParentId = null;
    this.history = [];

    this.render();

    dialog.showModal();
  }

  connectedCallback() {
    super.connectedCallback();

    const toggleButton = this.shadowRoot?.querySelector("#side-nav-toggle");
    if (toggleButton) {
      toggleButton.innerHTML = "";
      toggleButton.appendChild(icon("menu-open"));

      toggleButton.addEventListener("click", () => this.open());
    }

    this.render();
  }

  render() {
    const dialog = this.shadowRoot?.getElementById(
      "side-nav",
    ) as HTMLDialogElement | null;
    if (!dialog) return;

    dialog.innerHTML = "";

    const items = pageStore.getChildren(this.currentParentId);
    const parentPage = this.currentParentId
      ? pageStore.getParent(this.currentParentId)
      : null;

    const menu = renderNavMenu({
      items: items,
      canGoBack: this.history.length > 0,
      parentTitle: parentPage?.title || "Zurück",
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

    dialog.appendChild(menu);
  }
}

if (!customElements.get("app-nav")) {
  customElements.define("app-nav", AppNav);
}

export default AppNav;
