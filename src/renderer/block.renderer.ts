import { environment } from "../environment/env";

interface BlockEditorList {
  content: string;
  items: BlockEditorList[];
}

export const renderBlock = (block: any): HTMLElement => {
  switch (block.type) {
    case "header":
      let header = document.createElement(`h${block.data.level}`);
      header.textContent = block.data.text;
      return header;

    case "paragraph":
      let p = document.createElement("p");
      p.textContent = block.data.text;
      return p;

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
            li.textContent = item.content;

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
      return newList;

    case "attaches":
      let link = document.createElement("a");
      link.href = `${environment.cmsUrl}${block.data.file.url}`;
      link.innerText = block.data.title;
      link.target = "_blank";
      return link;

    default:
      return document.createElement("div");
  }
};
