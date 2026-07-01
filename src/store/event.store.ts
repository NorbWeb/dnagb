import type { NagEvent } from "../types/event";
import { sortByDate } from "../utils/helper";
import { Signal } from "./signal";

export class EventStore {
  _events = new Signal<NagEvent[]>([]);

  async fetchEvents() {
    let cmsData: NagEvent[] = [];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_CMS_URL}/items/events`,
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      cmsData = data.data || [];
    } catch (error) {
      console.error("Fetch-Vorgang fehlgeschlagen:", error);
    }

    sortByDate(cmsData);

    this._events.value = cmsData;
  }

  get events() {
    return this._events.value;
  }

  get commingEvents() {
    const date = new Date();
    // const date = new Date("2026-04-06");

    return this._events.value.filter((f) => {
      return new Date(f.date_start) >= date;
    });
  }
}

export const eventStore = new EventStore();
