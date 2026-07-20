import "./styles/main.css";
import "./cms-page/cms-page-view";
import "./details-page/details-page";
import "./components/button/button";
import "./components/nav/app-nav";
import "./components/footer/footer";
import "../node_modules/maplibre-gl/dist/maplibre-gl.css";

import { initRouter } from "./router";
import { settingsStore } from "./store/settings.store";
import { pageStore } from "./store/page.store";
import { eventStore } from "./store/event.store";
import { newsStore } from "./store/news.store";
import { dojoStore } from "./store/dojo.store";
import { icon } from "./utils/icon";

if (import.meta.env.VITE_ENVIRONMENT !== "dev") {
  let devTools = document.getElementById("devTools");
  if (devTools) devTools.style.display = "none";
}

function initBackToTopButton() {
  const sentinel = document.querySelector("#top-sentinel");
  const backToTop = document.querySelector("#back-to-top");
  const backToTopButton = backToTop?.querySelector("app-button");
  if (!backToTop || !backToTopButton || !sentinel) return;

  backToTopButton.appendChild(icon("chevron-up"));
  backToTopButton.addEventListener("click", () => {
    window.scrollTo(0, 0);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Wenn der Sentinel NICHT mehr zu sehen ist -> Button zeigen
        if (!entry.isIntersecting) {
          backToTop.classList.remove("hidden");
          backToTop.ariaHidden = "false";
        } else {
          // Wenn wir wieder oben sind -> Button ausblenden
          backToTop.classList.add("hidden");
          backToTop.ariaHidden = "true";
        }
      });
    },
    {
      root: null,
      rootMargin: "100% 0px 0px 0px",
      threshold: 0,
    },
  );

  observer.observe(sentinel);
}

async function init() {
  await settingsStore.fetchSettings();
  await pageStore.fetchPages();
  initRouter();
  await eventStore.fetchEvents();
  await newsStore.fetchNews();
  await dojoStore.fetchDojos();
  initBackToTopButton();
}

init();
