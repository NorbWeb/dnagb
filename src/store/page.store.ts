import { Signal } from "./signal";
import type { Page } from "../types/page";

export class PageStore {
  _pages = new Signal<Page[]>([]);
  _pageTree = new Signal<Page[]>([]);

  async fetchPages() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_CMS_URL}/items/pages?filter={"status":{"_eq":"published"}}`,
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      const menuPages = data.data.filter(
        (page: Page) => page.link_location === "menu",
      );
      const tree = this.createPageTree(menuPages);
      this._pageTree.value = tree;
      this._pages.value = this.flattenTree(tree);
    } catch (error) {
      console.error("Fetch-Vorgang fehlgeschlagen:", error);
    }
  }

  get pages() {
    return this._pages;
  }

  get pageTree() {
    return this._pageTree;
  }

  findByPath(pathName: string) {
    let result = this._pages.value.find((f: Page) => f.fullPath === pathName);
    return result;
  }

  createPageTree(pages: Page[]) {
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
      node.fullPath = `${parentPath}/${node.slug}`.replace(/\/+/g, "/");
      if (node.children.length > 0) {
        this.updatePaths(node.children, node.fullPath);
      }
    }
    return nodes;
  }
}

export const pageStore = new PageStore();
