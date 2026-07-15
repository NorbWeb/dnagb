import { Component } from "../../utils/base-component";
import html from "./dojo.html?raw";
import styles from "./dojo.css?inline";
import { dojoStore } from "../../store/dojo.store";
import {
  AttributionControl,
  Map,
  Marker,
  NavigationControl,
  Popup,
  type LngLatLike,
} from "maplibre-gl";
import { covertToGeoJson } from "../../utils/helper";

class Dojo extends Component {
  static html = html;
  static styles = styles;

  map: Map | undefined;
  popup = new Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 18,
    className: "dojo-popup",
    maxWidth: "10rem",
  });
  private justClosedDialog = false;

  constructor() {
    super();
    this.watch(dojoStore._dojos);
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("full-width");
  }

  initMap() {
    const mapContainer = this.shadowRoot?.querySelector("#map");

    if (!mapContainer) {
      console.error("Map container not found in shadowRoot");
      return;
    }

    this.map = new Map({
      container: mapContainer as HTMLElement,
      style:
        "https://sgx.geodatenzentrum.de/gdz_basemapworld_vektor/styles/bm_web_wld_col.json",
      center: [10.415, 51.356],
      zoom: 5.3,
      maxZoom: 10,
      attributionControl: false,
    });

    this.map.addControl(new NavigationControl({}), "top-right");
    this.map.addControl(
      new AttributionControl({
        compact: true,
      }),
    );
    // this.map.addControl(new ZoomToExtendControl());

    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();

    this.map.on("load", async () => {
      let dojos: any = covertToGeoJson(dojoStore.dojos);

      this.map?.addSource("dojo-source", {
        type: "geojson",
        data: dojos,
      });

      this.map?.addLayer({
        id: "dojos",
        type: "circle",
        source: "dojo-source",
        paint: {
          "circle-radius": 20,
          "circle-opacity": 0,
        },
      });

      for (const dojo of dojos.features) {
        dojoStore.setDojoInfo(dojo, "geojson");

        const el = document.createElement("div");
        el.className = "dojo-marker";
        el.tabIndex = 0;
        el.setAttribute("role", "button");
        el.addEventListener("click", (e: Event) => {
          e.stopPropagation();
          dojoStore.setDojoInfo(dojo, "geojson");
          console.log(dojoStore.dojoInfo);

          // this.dojoDialog()?.nativeElement.show();
          // const dialog = this.dojoDialog();
          // if (dialog && dialog.nativeElement.children[1]) {
          //   (dialog.nativeElement.children[1] as HTMLElement).scrollTop = 0;
          // }
        });

        el.addEventListener("keyup", (e: KeyboardEvent) => {
          if (e.code === "Enter") {
            e.stopPropagation();
            if (this.justClosedDialog) {
              // Ignore if dialog was just closed
              return;
            }
            dojoStore.setDojoInfo(dojo, "geojson");
            // this.dojoDialog()?.nativeElement.show();
          }
        });

        if (this.map) {
          new Marker({ element: el })
            .setLngLat(dojo.geometry.coordinates)
            .addTo(this.map);
        }
      }

      this.map?.on("sourcedataloading", (e) => {
        if (!e.isSourceLoaded && e.sourceId === "dojo-source") {
          this.map?.on("idle", () => {
            dojoStore.isLoading = false;
          });
        }
      });

      this.map?.on("mouseenter", "dojos", (e: any) => {
        this.popup.remove();

        if (!this.map) return;

        const coordinates = e.features[0].geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        let html = `<div>${e.features[0].properties.name} | ${e.features[0].properties.city}</div>`;

        this.popup.setLngLat(coordinates).setHTML(html).addTo(this.map);
      });

      this.map?.on("mouseleave", "dojos", () => {
        if (!this.map) return;
        this.popup.remove();
      });
    });
  }

  easeToPoint(centerArr: LngLatLike) {
    this.map?.flyTo({
      center: centerArr,
      zoom: 8.5,
      duration: 2000,
    });
  }

  render() {
    const mapContainer = this.shadowRoot?.querySelector("#map");
    if (mapContainer) {
      mapContainer.innerHTML = "";
      setTimeout(() => {
        this.initMap();
      }, 0);
    }
  }
}

if (!customElements.get("app-dojo")) {
  customElements.define("app-dojo", Dojo);
}
