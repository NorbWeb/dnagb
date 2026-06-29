export interface NagEvent {
  id: number;
  status: "published" | "draft";
  sort: null;
  user_created: string;
  date_created: string;
  user_updated: null | string;
  date_updated: null | string;
  description: string;
  date_start: string;
  date_end: string;
  location_name: string;
  title: string;
  announcement: string;
  type: Array<"seminar" | "examination" | "contest">;
  city: string;
  street: string;
  number: string;
  postal_code: string;
  image: string;
  event_files: any[];
}
