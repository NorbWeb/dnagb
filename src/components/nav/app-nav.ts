// components/nav/app-nav.ts
import { pageStore } from "../../store/page.store";
import { renderNavMenu } from "../../renderer/navMenu.renderer";
import styles from "./app-nav.css?inline";
import "./app-nav.css";

const navTemplate = document.createElement("template");
navTemplate.innerHTML = `
  <nav id="nav-container"></nav>
`;

class AppNav extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });

    // 1. Füge die CSS-Stile zum Shadow DOM hinzu
    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    shadowRoot.appendChild(styleElement);
    shadowRoot.appendChild(navTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    // 1. Sofort rendern, falls Daten im Cache (verhindert Flimmern)
    // if (sessionStorage.getItem("nav_tree")) {
    //   this.render();
    // }

    // 2. Daten laden (im Hintergrund aktualisieren)
    pageStore.fetchPages().then(() => this.render());

    // 3. Auf Klicks lauschen, um SPA-Navigation statt Reloads zu nutzen
    this.addEventListener("click", this.handleNavigation);
  }

  private handleNavigation(e: Event) {
    const target = (e.target as HTMLElement).closest("a");
    if (target) {
      e.preventDefault();
      const path = target.getAttribute("href");
      if (path) {
        // Nutze die Navigation API für den SPA-Wechsel
        navigation.navigate(path);
      }
    }
  }

  render() {
    const pages = pageStore.pageTree || [];

    const container = this.shadowRoot?.getElementById("nav-container");
    if (!container) return;
    container.innerHTML = ""; // Container leeren
    container.appendChild(renderNavMenu(pages));

    // pages.forEach((page) => {
    //   if (page.link_location === "menu") {
    //     const item = document.createElement("nav-item");
    //     item.setAttribute("href", page.fullPath);
    //     item.textContent = page.title;
    //     container.appendChild(item);
    //   }
    // });
  }
}

if (!customElements.get("app-nav")) {
  customElements.define("app-nav", AppNav);
}

export default AppNav;
