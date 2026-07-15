import { Signal } from "./signal";
import type { Page } from "../types/page";
import type { StaticPage } from "../types/staticPage";

export class PageStore {
  _pages = new Signal<(StaticPage | Page)[]>([]);
  _footerLinks = new Signal<(StaticPage | Page)[]>([]);

  private sortPages(pages: (StaticPage | Page)[]): (StaticPage | Page)[] {
    return [...pages].sort((a, b) => {
      const sortA = a.sort || -1;
      const sortB = b.sort || -1;
      return sortA - sortB;
    });
  }

  async fetchPages() {
    const staticRoutes: StaticPage[] = [
      {
        title: "Home",
        link_location: "menu",
        fullPath: "/home",
        sort: 0,
        component: "app-home",
        static_page: true,
        parent: null,
        status: "published",
        id: "home",
      },
      {
        title: "Aktuelles",
        link_location: "menu",
        fullPath: "/aktuelles",
        sort: 0,
        component: "app-news",
        static_page: true,
        parent: null,
        status: "published",
        id: "news",
      },
      {
        title: "Naginata Gruppen",
        link_location: "menu",
        fullPath: "/naginata-gruppen",
        sort: 0,
        component: "app-dojo",
        static_page: true,
        parent: null,
        status: "published",
        id: "naginata-group",
      },
    ];

    let cmsData: Page[] = [];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_CMS_URL}/items/pages?filter={"status":{"_eq":"published"}}`,
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      cmsData = data.data || [];
    } catch (error) {
      console.error("Fetch-Vorgang fehlgeschlagen:", error);
    }

    this._pages.value = this.processPages([
      ...staticRoutes.filter((r) => r.status === "published"),
      ...cmsData.filter((p) => p.link_location === "menu"),
    ]);

    this._footerLinks.value = this.processPages(
      cmsData.filter((p) => p.link_location === "footer"),
    );
  }

  private processPages(items: (Page | StaticPage)[]): (Page | StaticPage)[] {
    const sorted = this.sortPages(items);
    return this.buildPaths(sorted);
  }

  get pages() {
    return this._pages;
  }

  get footerLinks() {
    return this._footerLinks;
  }

  getChildren(parentId: string | null) {
    return this._pages.value.filter((p) => p.parent === parentId);
  }

  getParent(parentId: string) {
    return this._pages.value.find((p) => p.id === parentId);
  }

  hasChildren(parentId: string) {
    return this._pages.value.some((p) => p.parent === parentId);
  }

  findByPath(pathName: string) {
    return [...this._pages.value, ...this._footerLinks.value].find(
      (p) => p.fullPath === pathName,
    );
  }

  getHomeNavButtons() {
    return this._pages.value.filter((p) =>
      "show_on_home" in p && p.show_on_home ? p.show_on_home === true : null,
    );
  }

  private buildPaths(pages: (Page | StaticPage)[]): (Page | StaticPage)[] {
    const pageMap = new Map(pages.map((p) => [p.id, p]));

    const getPath = (page: Page | StaticPage): string => {
      if (page.static_page && page.fullPath) return page.fullPath;

      const dynamicPage = page as Page;
      if (!page.parent || !pageMap.has(page.parent)) {
        return `/${dynamicPage.slug || ""}`.replace(/\/+/g, "/");
      }

      const parentPage = pageMap.get(page.parent)!;
      return `${getPath(parentPage)}/${dynamicPage.slug || ""}`.replace(
        /\/+/g,
        "/",
      );
    };

    for (const page of pages) {
      if (!page.static_page) {
        page.fullPath = getPath(page);
      }
    }

    return pages;
  }
}

export const pageStore = new PageStore();
