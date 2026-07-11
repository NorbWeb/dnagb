import "./styles/main.css";
import "./cms-page/cms-page-view";
import "./details-page/details-page";
import "./components/button/button";
import "./components/nav/app-nav";
import "./components/footer/footer";

import { initRouter } from "./router";
import { testStore } from "./store/test.store";
import { settingsStore } from "./store/settings.store";
import { pageStore } from "./store/page.store";
import { eventStore } from "./store/event.store";
import { newsStore } from "./store/news.store";

// dev tools
const setButton = document.getElementById("setButton");
const getButton = document.getElementById("getButton");
const resetButton = document.getElementById("resetButton");

setButton?.addEventListener("click", (e: any) => {
  switch (testStore.test.length) {
    case 0:
      testStore.add("1");
      console.log(`add: ${testStore.test[testStore.test.length - 1]}`);

      break;

    default:
      const lastValue = testStore.test[testStore.test.length - 1];
      testStore.add(`${lastValue} + 1`);
      console.log(`add: ${testStore.test[testStore.test.length - 1]}`);
      break;
  }
});

getButton?.addEventListener("click", (e: any) => {
  console.log(testStore.test);
});

resetButton?.addEventListener("click", () => {
  testStore.reset();
  console.debug("reset test store");
});

if (import.meta.env.VITE_ENVIRONMENT !== "dev") {
  let devTools = document.getElementById("devTools");
  if (devTools) devTools.style.display = "none";
}

async function init() {
  await settingsStore.fetchSettings();
  await pageStore.fetchPages();
  initRouter();
  await eventStore.fetchEvents();
  await newsStore.fetchNews();
}

init();
