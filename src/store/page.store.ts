import { Signal } from "./signal";
import type { Page } from "../types/page";
import type { StaticPage } from "../types/staticPage";

export class PageStore {
  _pages = new Signal<Page[]>([]);
  _pageTree = new Signal<Page[]>([]);

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
        status: "draft",
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
    const allMenuPages: (Page | StaticPage)[] = [
      ...staticRoutes.filter((route) => route.status === "published"),
      ...cmsData.filter((page: Page) => page.link_location === "menu"),
    ];

    allMenuPages.sort((a, b) => {
      const sortA = a.sort === 0 || !a.sort ? -1 : a.sort;
      const sortB = b.sort === 0 || !b.sort ? -1 : b.sort;

      return sortA - sortB;
    });

    const tree = this.createPageTree(allMenuPages);
    this._pageTree.value = tree;
    this._pages.value = this.flattenTree(tree);
  }

  get pages() {
    return this._pages;
  }

  get pageTree() {
    return this._pageTree;
  }

  findByPath(pathName: string) {
    let result = this._pages.value.find(
      (f: Page | StaticPage) => f.fullPath === pathName,
    );
    return result;
  }

  createPageTree(pages: (Page | StaticPage)[]) {
    const map: Record<string, any> = {};
    const tree: Page[] = [];

    for (const item of pages) {
      map[item.id] = { ...item, children: map[item.id]?.children || [] };
      const currentItem = map[item.id];

      if (item.parent === null) {
        tree.push(currentItem);
      } else {
        if (!map[item.parent]) {
          map[item.parent] = { children: [] };
        }

        map[item.parent].children.push(currentItem);
      }
    }

    this.updatePaths(tree);
    return tree;
  }

  private flattenTree(nodes: Page[], result: Page[] = []): Page[] {
    for (const node of nodes) {
      result.push(node);
      if (node.children && node.children.length > 0) {
        this.flattenTree(node.children, result);
      }
    }
    return result;
  }

  updatePaths(nodes: Page[], parentPath = ""): Page[] {
    for (const node of nodes) {
      if (node.static_page) {
        continue;
      }
      node.fullPath = `${parentPath}/${node.slug}`.replace(/\/+/g, "/");
      if (node.children.length > 0) {
        this.updatePaths(node.children, node.fullPath);
      }
    }
    return nodes;
  }
}

export const pageStore = new PageStore();
