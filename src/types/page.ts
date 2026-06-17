export interface Page {
  children: Page[];
  content: string;
  date_updated: string;
  fullPath: string;
  id: string;
  show_title: boolean;
  parent: string | null;
  slug: string;
  slug_manual_override: boolean;
  sort: number;
  status: "draft" | "published";
  title: string;
  user_updated: string | null;
}
