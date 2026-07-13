export function icon(iconId: string): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  // Diese Attribute sind zwingend für die korrekte Skalierung
  svg.setAttribute("class", "icon");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.style.display = "inline-block";

  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

  use.setAttribute("href", `/assets/icons/sprite.svg#${iconId}`);

  svg.appendChild(use);
  return svg;
}
