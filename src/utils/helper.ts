import type { Dojo, Source, Feature } from "../types/dojo";

export function sortByDate(items: any[]) {
  items.sort((a, b) => {
    const sortA = new Date(a.date_start);
    const sortB = new Date(b.date_start);

    return sortB.getTime() - sortA.getTime();
  });
}

export const formatDateRange = (
  start: Date | string | null,
  end: Date | string | null,
  showTime: boolean = true,
): string => {
  if (!start) return "";

  const startDate = new Date(start);

  // Formatierer für Datum
  const dateFormater = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

  // Formatierer für Uhrzeit
  const timeFormater = new Intl.DateTimeFormat("de-DE", {
    hour: "numeric",
    minute: "numeric",
  });

  const formattedDate = dateFormater.format(startDate);
  const formattedTime = showTime
    ? `, ${timeFormater.format(startDate)} Uhr`
    : "";

  // 1. Fall: Kein Enddatum
  if (!end) {
    return `${formattedDate}${formattedTime}`;
  }

  const endDate = new Date(end);
  const sameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();

  // 2. Fall: Gleicher Tag
  if (sameDay) {
    if (showTime) {
      return `${formattedDate}, ${timeFormater.format(startDate)} – ${timeFormater.format(endDate)} Uhr`;
    }
    return formattedDate;
  }

  // 3. Fall: Verschiedene Tage
  if (showTime) {
    return `${formattedDate}, ${timeFormater.format(startDate)} Uhr – ${dateFormater.format(endDate)}, ${timeFormater.format(endDate)} Uhr`;
  }

  return `${formattedDate} – ${dateFormater.format(endDate)}`;
};

export function covertToGeoJson(rawData: Dojo[]) {
  let source: Source = {
    type: "FeatureCollection",
    features: [],
  };

  for (const item of rawData) {
    let feature: Feature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "",
        coordinates: [],
      },
    };
    feature.properties = {
      city: item.city,
      description: item.description,
      link: item.link,
      name: item.name,
      status: item.status,
      logo: item.logo,
    };
    feature.geometry.type = item.geometry.type;
    feature.geometry.coordinates = [...item.geometry.coordinates];
    source.features.push(feature);
  }

  return source;
}
