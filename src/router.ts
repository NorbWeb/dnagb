// router.ts
import { settingsStore } from "./store/settings.store.ts";
import { pageStore } from "./store/page.store";
import "./static-pages/error-404/error-404.ts";
import "./static-pages/news/news.ts";
import "./static-pages/home/home.ts";
import "./static-pages/dojo/dojo.ts";

async function handleNavigation(pathname: string) {
  const content = document.querySelector("#page-content");
  if (!content) return;

  // Diese Funktion baut den neuen View-Inhalt zusammen
  const updateDOM = () => {
    // 1. Root redirect
    if (pathname === "" || pathname === "/") {
      history.replaceState(null, "", "/home");
      return handleNavigation("/home");
    }

    // 2. Details pages
    if (pathname.startsWith("/event/") || pathname.startsWith("/news/")) {
      const parts = pathname.split("/");
      const type = parts[1];
      const id = parts[2];
      const detailsView = document.createElement("app-details-page");
      detailsView.setAttribute("type", type);
      detailsView.setAttribute("id", id);
      content.replaceChildren(detailsView);
      document.title = `${type.charAt(0).toUpperCase() + type.slice(1)} | ${settingsStore.settings?.title_short}`;
      return;
    }

    // 3. Static/Dynamic pages
    const page = pageStore.findByPath(pathname);
    if (!page) {
      content.replaceChildren(document.createElement("page-error-404"));
      document.title = `Seite nicht gefunden | ${settingsStore.settings?.title_short}`;
      return;
    }

    let newView: HTMLElement;
    if (page.static_page && page.component) {
      const isDefined = customElements.get(page.component);
      newView = document.createElement(
        isDefined ? page.component : "page-error-404",
      );
      document.title = `${page.title} | ${settingsStore.settings?.title_short}`;
    } else {
      newView = document.createElement("page-view");
      newView.setAttribute("path", pathname);
      document.title = `${page.title} | ${settingsStore.settings?.title_short}`;
    }

    content.replaceChildren(newView);
  };

  // --- HIER IST DIE MAGIE ---
  if (document.startViewTransition) {
    // Browser führt Update innerhalb der Transition aus
    await document.startViewTransition(() => updateDOM()).finished;
  } else {
    // Fallback für Browser ohne View Transition Support
    updateDOM();
  }
}

export function initRouter() {
  handleNavigation(window.location.pathname);
  navigation.addEventListener("navigate", (event: any) => {
    const url = new URL(event.destination.url);

    event.intercept({
      async handler() {
        await handleNavigation(url.pathname);
      },
    });
  });
}
