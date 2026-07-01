import type { News } from "../types/news";
import { Signal } from "./signal";

export class NewsStore {
  _news = new Signal<News[]>([]);

  async fetchNews() {
    let cmsData: News[] = [];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_CMS_URL}/items/news`,
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      cmsData = data.data || [];
    } catch (error) {
      console.error("Fetch-Vorgang fehlgeschlagen:", error);
    }

    this._news.value = cmsData;
  }

  get news() {
    return this._news.value;
  }
}

export const newsStore = new NewsStore();
