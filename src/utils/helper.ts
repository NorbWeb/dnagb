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
    month: "2-digit",
    year: "numeric",
  });

  // Formatierer für Uhrzeit
  const timeFormater = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
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
