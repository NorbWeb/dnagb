// router.ts
import { pageStore } from "./store/page.store";
import "./static-pages/error-404/error-404.ts";
import "./static-pages/news/news.ts";
import "./static-pages/home/home.ts";
import "./static-pages/dojo/dojo.ts";

async function handleNavigation(pathname: string) {
  const main = document.querySelector("main");
  if (!main) return;

  // Hole die Seite direkt aus deinem aufbereiteten Store
  const page = pageStore.findByPath(pathname);

  if (!page) {
    main.replaceChildren(document.createElement("page-error-404"));
    return;
  }

  let newView: HTMLElement;

  if (page.static_page && page.component) {
    const isDefined = customElements.get(page.component);
    if (isDefined) {
      newView = document.createElement(page.component);
    } else {
      newView = document.createElement("page-error-404");
    }
  } else {
    newView = document.createElement("page-view");
    newView.setAttribute("path", pathname);
  }

  main.replaceChildren(newView);
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
