export interface Page {
  children: Page[];
  text_editor: string;
  block_editor: null | any;
  content_radio_switch: "text_editor" | "block_editor";
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
