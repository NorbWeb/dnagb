// router.ts
import { pageStore } from "./store/page.store";
import "./static-pages/error-404/error-404.ts";
import "./static-pages/news/news.ts";
import "./static-pages/home/home.ts";
import "./static-pages/dojo/dojo.ts";

async function handleNavigation(pathname: string) {
  const main = document.querySelector("main");
  if (!main) return;

  // Redirect root path to /home
  if (pathname === "" || pathname === "/") {
    history.replaceState(null, "", "/home");
    return handleNavigation("/home");
  }

  // Handle event and news details pages
  if (pathname.startsWith("/event/") || pathname.startsWith("/news/")) {
    const parts = pathname.split("/");
    const type = parts[1];
    const id = parts[2];

    const detailsView = document.createElement("app-details-page");
    detailsView.setAttribute("type", type);
    detailsView.setAttribute("id", id);

    main.replaceChildren(detailsView);
    return;
  }

  // Handle static pages and dynamic pages
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
