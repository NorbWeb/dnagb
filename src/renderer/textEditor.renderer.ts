import type { Page } from "../types/page";

export function modifiedTextEditor(page: Page): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(page.text_editor, "text/html");

  const tables = doc.querySelectorAll("table");

  for (const table of tables) {
    prepareTableForResponsive(table);
    const wrapper = document.createElement("div");
    wrapper.classList.add("table-wrapper", page.table_break_view);

    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  }

  return doc.body.innerHTML;
}

function prepareTableForResponsive(table: HTMLTableElement) {
  const headerRows = Array.from(table.querySelectorAll("thead tr"));

  if (headerRows.length > 0) {
    const headerLabels: string[][] = headerRows.map((row) => {
      row.classList.add("table-header-row");
      return Array.from(row.querySelectorAll("th, td")).map(
        (cell) => cell.textContent?.trim() || "",
      );
    });

    const dataRows = Array.from(table.querySelectorAll("tbody tr"));
    dataRows.forEach((row) => {
      row.classList.add("table-data-row");
      const cells = Array.from(row.querySelectorAll("td"));

      cells.forEach((td, colIndex) => {
        const label = headerLabels
          .map((labels) => labels[colIndex])
          .filter(Boolean)
          .join(" - ");

        if (label) {
          td.setAttribute("data-label", label);
        }
      });
    });
  } else {
    const allRows = Array.from(table.querySelectorAll("tr"));
    allRows.forEach((row) => row.classList.add("table-data-row"));
  }
}
