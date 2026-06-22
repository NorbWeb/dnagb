// components/nav/app-nav.ts
import { pageStore } from "../../store/page.store";
import { renderNavMenu } from "../../renderer/navMenu.renderer";
import "./app-nav.css";

class AppNav extends HTMLElement {
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
    this.appendChild(renderNavMenu(pages));
  }
}

if (!customElements.get("app-nav")) {
  customElements.define("app-nav", AppNav);
}

export default AppNav;
