export interface StaticPage {
  link_location: "menu" | "footer";
  fullPath: string;
  sort: number;
  title: string;
  component: string;
  static_page: true;
  parent: string | null;
  status: "draft" | "published";
}
