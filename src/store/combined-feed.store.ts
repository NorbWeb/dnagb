import { eventStore } from "./event.store";
import { newsStore } from "./news.store";
import { Signal } from "./signal";
import { sortByDate } from "../utils/helper";
import type { NagEvent } from "../types/event";
import type { News } from "../types/news";

export class CombinedFeedStore {
  _allContent = new Signal<(NagEvent | News)[]>([]);

  constructor() {
    // Abonniere die Änderungen beider Stores
    eventStore._events.subscribe(() => this.updateCombined());
    newsStore._news.subscribe(() => this.updateCombined());
  }

  private updateCombined() {
    const combined = [...eventStore.events, ...newsStore.news];
    sortByDate(combined);
    this._allContent.value = combined;
  }

  // Getter für die UI, um auf den Wert zuzugreifen
  get allContent() {
    return this._allContent.value;
  }
}

export const feedStore = new CombinedFeedStore();
