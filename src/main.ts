import "./styles/main.css";
import "./components/button/button";
import "./components/nav/app-nav";
import { testStore } from "./store/test.store";

const setButton = document.getElementById("setButton");
const getButton = document.getElementById("getButton");
const resetButton = document.getElementById("resetButton");

// Event-Listener für das Custom Event
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
