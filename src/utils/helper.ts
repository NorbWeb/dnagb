export function sortByDate(items: any[]) {
  items.sort((a, b) => {
    const sortA = new Date(a.date_start);
    const sortB = new Date(b.date_start);

    return sortB.getTime() - sortA.getTime();
  });
}
