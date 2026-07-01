// card.render.ts
import { formatDateRange } from "../utils/helper";

export function renderNewsCard(element: any): HTMLElement {
  const card = document.createElement("app-news-card");

  // Logik für CSS-Klassen
  if ("isPast" in element && element.isPast) {
    card.setAttribute("is-past", "true");
  }

  // Bild-Logik
  card.setAttribute(
    "image-src",
    element.image
      ? `${import.meta.env.VITE_CMS_URL}/assets/${element.image}`
      : "/assets/placeholder.jpg",
  );

  // Basistexte
  card.setAttribute("title", element.title);
  card.setAttribute("teaser", element.announcement);
  card.setAttribute("link-url", `/events/${element.id}`);

  // Datum und Link-Text
  card.setAttribute(
    "date",
    formatDateRange(
      element.date_start,
      element.date_end,
      element.fe_type === "news" ? false : true,
    ),
  );

  card.setAttribute(
    "link-text",
    element.fe_type === "news" ? "zum Artikel" : "zum Event",
  );

  return card;
}
