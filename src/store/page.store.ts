import { Signal } from "./signal";
import { environment } from "../environment/env";

export class PageStore {
  private _pages: any[] = [];

  async fetchPages() {
    // fields=slug,title,parent.id,sort holt die wichtigen Infos
    const res = await fetch(`${environment.cmsUrl}/items/pages`);
    const data = await res.json();
    this._pages = data.data;
  }

  get pages() {
    return this._pages;
  }

  get pageTree() {
    const map: any = {};
    const tree: any[] = [];

    // Erst alle in eine Map
    this._pages.forEach((p) => (map[p.id] = { ...p, children: [] }));

    // Dann den Baum bauen
    this._pages.forEach((p) => {
      if (p.parent) {
        map[p.parent.id]?.children.push(map[p.id]);
      } else {
        tree.push(map[p.id]);
      }
    });
    console.log(tree);
    return tree;
  }
}
export const pageStore = new PageStore();
