export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  parent: string | null;
  children: Page[]; // Rekursive Struktur
  fullPath: string;
  sort: number;
  user_updated: string;
  date_updated: string;
}
