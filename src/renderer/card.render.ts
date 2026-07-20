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

  // Datum und Link-Text
  card.setAttribute(
    "date",
    formatDateRange(element.date_start, element.date_end, false),
  );

  // Basistexte
  card.setAttribute("title", element.title);
  let teaserText = "";
  if (element.details) {
    let firstParagraph = element.details.blocks.find(
      (block: any) => block.type === "paragraph",
    );
    teaserText = firstParagraph.data.text;
  }
  card.setAttribute("teaser", teaserText || "");

  card.setAttribute("link-url", `/${element.fe_type}/${element.id}`);

  if (element.type) {
    card.setAttribute("type", element.type);
  }

  return card;
}
