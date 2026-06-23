// router.ts
import { pageStore } from "./store/page.store";
import "./static-pages/error-404.ts";

async function handleNavigation(pathname: string) {
  const main = document.querySelector("main");
  if (!main) return;

  const page = pageStore.findByPath(pathname);

  // Erstelle das neue Element
  const newView = page
    ? document.createElement("page-view")
    : document.createElement("page-error-404");

  if (page) {
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
