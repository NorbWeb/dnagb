import type { Page } from "../types/page";
import { icon } from "../utils/icon";

interface BlockEditorList {
  content: string;
  items: BlockEditorList[];
}

function findAnchorTagsAndAddTargetBlank(html: HTMLElement): HTMLElement {
  let anchorTags = html.querySelectorAll("a");
  anchorTags.forEach((anchor) => {
    anchor.setAttribute("target", "_blank");
  });

  return html;
}

export const renderBlock = (block: any, page: Page | null): HTMLElement => {
  switch (block.type) {
    case "header":
      let header = document.createElement(`h${block.data.level}`);
      header.innerHTML = block.data.text;
      return findAnchorTagsAndAddTargetBlank(header);

    case "paragraph":
      let p = document.createElement("p");
      p.innerHTML = block.data.text;
      return findAnchorTagsAndAddTargetBlank(p);

    case "quote":
      let quoteFigure = document.createElement("figure");
      quoteFigure.classList.add("quote-figure");
      let blockquote = document.createElement("blockquote");
      quoteFigure.appendChild(blockquote);
      let blockText = document.createElement("div");
      blockText.innerHTML = block.data.text;
      blockquote.appendChild(blockText);
      let quoteFigcaption = document.createElement("figcaption");
      quoteFigcaption.innerHTML = block.data.caption;
      if (block.data.caption && block.data.caption !== "<br>") {
        blockquote.appendChild(quoteFigcaption);
      }
      return findAnchorTagsAndAddTargetBlank(quoteFigure);

    case "delimiter":
      let delimiter = document.createElement("hr");
      return delimiter;

    case "checklist":
      const ul = document.createElement("ul");
      ul.className = "checklist-display";
      for (const item of block.data.items) {
        const li = document.createElement("li");
        const mark = icon(item.checked ? "checked" : "unchecked");
        li.appendChild(mark);
        const span = document.createElement("span");
        span.innerHTML = item.text;
        li.appendChild(span);
        li.className = item.checked ? "checked" : "unchecked";
        ul.appendChild(li);
      }
      return findAnchorTagsAndAddTargetBlank(ul);

    case "table":
      let wrapper = document.createElement("div");
      wrapper.classList.add("table-wrapper", page?.table_break_view || "none");
      let table = document.createElement("table");
      let thead = document.createElement("thead");
      let tbody = document.createElement("tbody");
      let asHead = block.data.withHeadings;
      let headerLabels: string[] = [];

      for (const tableRow of block.data.content) {
        let row = document.createElement("tr");
        for (const tableCell of tableRow) {
          let cell = document.createElement(asHead ? "th" : "td");
          cell.innerHTML = tableCell;
          row.appendChild(cell);
        }
        if (asHead) {
          row.classList.add("table-header-row");
          headerLabels = Array.from(row.children).map((cell) => {
            return cell.textContent?.trim() || "";
          });
          thead.appendChild(row);
        } else {
          row.classList.add("table-data-row");
          const cells = Array.from(row.querySelectorAll("td"));

          cells.forEach((td, colIndex) => {
            const label = headerLabels[colIndex];
            if (label) {
              td.setAttribute("data-label", label);
            }
          });

          tbody.appendChild(row);
        }
        asHead = false;
      }
      table.appendChild(thead);
      table.appendChild(tbody);
      wrapper.appendChild(table);
      return findAnchorTagsAndAddTargetBlank(wrapper);

    case "nestedlist":
      function generateListElements(block: any) {
        const { type, items } = block.data;
        const listElement = document.createElement(
          type === "ordered" ? "ol" : "ul",
        );

        function buildList(
          items: BlockEditorList[],
          parentElement: HTMLElement,
        ) {
          for (const item of items) {
            const li = document.createElement("li");
            li.innerHTML = item.content;

            if (item.items && item.items.length > 0) {
              const subList = document.createElement(
                type === "ordered" ? "ol" : "ul",
              );
              buildList(item.items, subList);
              li.appendChild(subList);
            }

            parentElement.appendChild(li);
          }
        }

        buildList(items, listElement);
        return listElement;
      }
      const newList = generateListElements(block);
      return findAnchorTagsAndAddTargetBlank(newList);

    case "attaches":
      let downloadBox = document.createElement("a");
      downloadBox.classList.add("file-download");
      downloadBox.href = `${import.meta.env.VITE_CMS_URL}${block.data.file.url}`;
      downloadBox.target = "_blank";

      let fileType = document.createElement("div");
      fileType.classList.add("file-type");
      fileType.textContent = block.data.file.extension;
      downloadBox.appendChild(fileType);

      let fileInfo = document.createElement("div");
      fileInfo.classList.add("file-info");
      downloadBox.appendChild(fileInfo);

      let fileName = document.createElement("span");
      fileName.classList.add("file-name");
      fileName.textContent = block.data.file.title || block.data.file.name;
      fileInfo.appendChild(fileName);

      let fileSize = document.createElement("span");
      fileSize.classList.add("file-size");
      function formatBytes(bytes: number, decimals = 1) {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return (
          parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
        );
      }
      fileSize.textContent = formatBytes(block.data.file.size);
      fileInfo.appendChild(fileSize);

      return findAnchorTagsAndAddTargetBlank(downloadBox);

    case "image":
      const { name, title, url } = block.data.file;
      let figure = document.createElement("figure");
      figure.classList.add("img-figure");
      let figcaption = document.createElement("figcaption");
      figcaption.innerHTML = block.data.caption;

      let img = document.createElement("img");
      img.title = title;
      img.alt = name;
      img.src = `${import.meta.env.VITE_CMS_URL}${url}`;

      figure.appendChild(img);
      figure.appendChild(figcaption);

      return findAnchorTagsAndAddTargetBlank(figure);

    default:
      console.debug("unmatched block: ", block);
      return document.createElement("div");
  }
};
