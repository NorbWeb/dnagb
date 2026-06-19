import { Signal } from "./signal";
import { environment } from "../environment/env";
import type { Page } from "../types/page";

export class PageStore {
  _pages = new Signal<Page[]>([]);
  _pageTree = new Signal<Page[]>([]);

  async fetchPages() {
    const res = await fetch(
      `${environment.cmsUrl}/items/pages?filter={"status":{"_eq":"published"}}`,
    );
    const data = await res.json();
    console.log(`📢 ~ PageStore ~ data:`, data);

    const tree = this.createPageTree(data.data);

    this._pageTree.value = tree;
    this._pages.value = this.flattenTree(tree);

    // const cachedData = sessionStorage.getItem("nav_tree");
    // if (cachedData) {
    //   this._pages.value = JSON.parse(cachedData);
    //   console.info("get local storrage");
    // } else {
    //   const res = await fetch(`${environment.cmsUrl}/items/pages`);
    //   const data = await res.json();
    //   this._pages.value = data.data;
    //   this._pageTree.value = this.createPageTree(data.data);
    //   sessionStorage.setItem("nav_tree", JSON.stringify(pageStore.pages));
    //   console.info("set page tree in local storrage");
    // }
  }

  get pages() {
    return this._pages.value;
  }

  get pageTree() {
    return this._pageTree.value;
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
