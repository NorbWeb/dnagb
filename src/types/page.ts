export interface Page {
  children: Page[];
  text_editor: string;
  block_editor: null | BlockEditor;
  content_radio_switch: "text_editor" | "block_editor";
  date_updated: string;
  fullPath: string;
  id: string;
  show_titel: "true" | "hide";
  parent: string | null;
  slug: string;
  slug_manual_override: boolean;
  link_location: "menu" | "footer";
  sort: number;
  status: "draft" | "published";
  title: string;
  user_updated: string | null;
  static_page?: false;
  component?: null;
}

export interface BlockEditor {
  time: number;
  blocks: Block[];
  version: string;
}

export interface Block {
  id: string;
  type: string;
  data: Data;
  tunes?: Tunes;
}

export interface Data {
  text?: string;
  level?: number;
  style?: string;
  items?: Item[];
  caption?: string;
  withBorder?: boolean;
  withBackground?: boolean;
  stretched?: boolean;
  file?: File;
}

export interface Item {
  content: string;
  items: Item[];
}

export interface File {
  width: number;
  height: number;
  size: string;
  name: string;
  title: string;
  extension: string;
  fileId: string;
  fileURL: string;
  url: string;
}

export interface Tunes {
  alignment: Alignment;
}

export interface Alignment {
  alignment: string;
}
