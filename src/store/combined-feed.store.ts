import { eventStore } from "./event.store";
import { newsStore } from "./news.store";
import { Signal } from "./signal";
import { sortByDate } from "../utils/helper";
import type { NagEvent } from "../types/event";
import type { News } from "../types/news";

export class CombinedFeedStore {
  _allContent = new Signal<(NagEvent | News)[]>([]);
  _filter = new Signal<string>("all");

  constructor() {
    eventStore._events.subscribe(() => this.updateCombined());
    newsStore._news.subscribe(() => this.updateCombined());
  }

  private updateCombined() {
    const now = new Date();
    const combined = [
      ...eventStore.events
        .map((e) => ({
          ...e,
          fe_type: "event",
          isPast: e.date_end
            ? new Date(e.date_end) < now
            : new Date(e.date_start) < now,
        }))
        .filter((e) => !e.isPast),
      ...newsStore.news.map((n) => ({ ...n, fe_type: "news", date_end: null })),
    ];
    sortByDate(combined);
    this._allContent.value = combined;
  }

  get allContent() {
    return this._allContent.value;
  }

  get filteredContent() {
    if (this._filter.value === "all") return this._allContent.value;
    return this._allContent.value.filter(
      (item) => item.fe_type === this._filter.value,
    );
  }

  get lastNews() {
    return this._allContent.value
      .filter((item) => item.fe_type === "news")
      .slice(0, 2);
  }

  get futureEvents() {
    return this._allContent.value.filter((item) => item.fe_type === "event");
  }

  get filter() {
    return this._filter.value;
  }

  setFilter(value: string) {
    this._filter.value = value;
  }

  filterById(id: string | null, type: string | null) {
    return this._allContent.value.find(
      (f) => f.id.toString() === id && f.fe_type === type,
    );
  }
}

export const feedStore = new CombinedFeedStore();
