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
    const dialog = this.shadowRoot?.getElementById(
      "side-nav",
    ) as HTMLDialogElement;

    if (dialog) {
      dialog.addEventListener("close", () => {
        this.currentParentId = null;
        this.history = [];

        this.render();
      });
    }

    dialog.addEventListener("click", (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      // Wenn außerhalb des Dialog-Bereichs geklickt wurde -> schließen
      if (!isInDialog) {
        dialog.close();
      }
    });
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
