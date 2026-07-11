import type { Settings } from "../types/settings";
import { Signal } from "./signal";

export class SettingsStore {
  _settings = new Signal<Settings | null>(null);

  async fetchSettings() {
    let cmsData: Settings | null = null;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_CMS_URL}/items/settings?filter={"status":{"_eq":"published"}}`,
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      cmsData = data.data || [];
    } catch (error) {
      console.error("Fetch-Vorgang fehlgeschlagen:", error);
    }

    this._settings.value = cmsData;

    console.log(`📢 ~ SettingsStore ~ _settings:`, this._settings.value);
    if (this._settings.value?.primary) {
      document.documentElement.style.setProperty(
        "--primary",
        this._settings.value?.primary,
      );
      document.documentElement.style.setProperty(
        "--primary-text",
        this._settings.value?.primary_text,
      );
      document.documentElement.style.setProperty(
        "--accent",
        this._settings.value?.accent,
      );
      document.documentElement.style.setProperty(
        "--text",
        this._settings.value?.text,
      );
      document.documentElement.style.setProperty(
        "--text-inverse",
        this._settings.value?.text_inverse,
      );
    }
  }

  get settings() {
    return this._settings.value;
  }
}

export const settingsStore = new SettingsStore();
