// router.ts
import { pageStore } from "./store/page.store";

export function initRouter() {
  navigation.addEventListener("navigate", async (event: any) => {
    const url = new URL(event.destination.url);

    // Wir sagen dem Browser: "Warte, ich kümmere mich darum"
    event.intercept({
      async handler() {
        // 1. Store nach der Seite fragen
        const page = pageStore.findByPath(url.pathname) as any;

        // 2. Main-Container suchen
        const main = document.querySelector("main");
        if (!main) return;

        // 3. Wenn Seite existiert, setze das Attribut - das triggert
        // das Rendern in der page-view automatisch (wegen attributeChangedCallback)
        if (page) {
          main.innerHTML = `<page-view path="${url.pathname}"></page-view>`;
        } else {
          main.innerHTML = `<h1>404 - Seite nicht gefunden</h1>`;
        }
      },
    });
  });
}
