import type { Dojo, DojoInfo } from "../types/dojo";
import { Signal } from "./signal";

export class DojoStore {
  _dojos = new Signal<Dojo[]>([]);
  _dojoInfo = new Signal<DojoInfo>({
    name: "",
    city: "",
    link: "",
    description: "",
    logo: "",
  });
  _isLoading = new Signal<boolean>(false);

  async fetchDojos() {
    let cmsData: Dojo[] = [];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_CMS_URL}/items/dojos?filter={"status":{"_eq":"published"}}`,
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      cmsData = data.data || [];
    } catch (error) {
      console.error("Fetch-Vorgang fehlgeschlagen:", error);
    }

    this._dojos.value = cmsData;
    console.log(
      "🐦‍⬛ ~ DojoStore ~ fetchDojos ~ this._dojos.value:",
      this._dojos.value,
    );
  }

  get dojos() {
    return this._dojos.value;
  }

  get dojoInfo() {
    return this._dojoInfo.value;
  }

  resetDojoInfo() {
    this._dojoInfo.value = {
      name: "",
      city: "",
      link: "",
      description: "",
      logo: "",
    };
  }

  setDojoInfo(dojo: any, type: "geojson" | "object") {
    this.resetDojoInfo();
    switch (type) {
      case "geojson":
        this._dojoInfo.value = {
          name: dojo.properties.name,
          city: dojo.properties.city,
          link: dojo.properties.link,
          description: dojo.properties.description,
          logo: dojo.properties.logo,
        };
        break;

      case "object":
        this._dojoInfo.value = {
          name: dojo.name,
          city: dojo.city,
          link: dojo.link,
          description: dojo.description,
          logo: dojo.logo,
        };
        break;

      default:
        break;
    }
  }

  get isLoading() {
    return this._isLoading.value;
  }

  set isLoading(state: boolean) {
    this._isLoading.value = state;
  }
}

export const dojoStore = new DojoStore();
