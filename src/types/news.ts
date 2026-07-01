export interface News {
  id: number;
  status: "published" | "draft";
  sort: null;
  user_created: string;
  date_created: string;
  user_updated: null | string;
  date_updated: null | string;
  article: string;
  image: any;
  title: string;
  announcement: string;
  date_start: string;
  date_end: string | null;
  author: string;
  fe_type: string;
}
