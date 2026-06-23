import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Aktuellen Pfad bestimmen
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Argument entgegennehmen (z.B. "new-component" oder "static-pages/new-component")
const inputPath = process.argv[2];
if (!inputPath) {
  console.error(
    "Bitte einen Pfad angeben: node scripts/generate.js <pfad/name>",
  );
  process.exit(1);
}

// 2. Zielverzeichnis und Dateinamen trennen
// Beispiel: "static-pages/new-component" -> dir="src/static-pages/new-component", name="new-component"
const targetDir = path.join("src", inputPath);
const componentName = path.basename(inputPath);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 3. Den relativen Pfad zur Basis-Komponente berechnen
// Wir wissen: Das Ziel ist 'src/utils/component.ts'
// Wir wissen: Unsere neue Datei liegt in 'targetDir/componentName.ts'
const utilsPath = path.join("src", "utils", "base-component");
const relativeBase = path.relative(targetDir, utilsPath);

// Sicherstellen, dass der Pfad auf Windows korrekt mit forward slashes gesetzt wird
const finalImportPath = relativeBase.replace(/\\/g, "/");

// 4. TS Vorlage generieren
const className = componentName
  .split("-")
  .map((p) => p[0].toUpperCase() + p.slice(1))
  .join("");

const tsContent = `import { Component } from "${finalImportPath.startsWith(".") ? "" : "./"}${finalImportPath}";
import html from "./${componentName}.html?raw";
import styles from "./${componentName}.css?inline";

class ${className} extends Component {
  static html = html;
  static styles = styles;

  constructor() {
    super();
  }

  render() {}
}

if (!customElements.get("app-${componentName}")) {
  customElements.define("app-${componentName}", ${className});
}
`;

fs.writeFileSync(path.join(targetDir, `${componentName}.ts`), tsContent);
fs.writeFileSync(
  path.join(targetDir, `${componentName}.html`),
  `<div>${componentName}</div>`,
);
fs.writeFileSync(path.join(targetDir, `${componentName}.css`), ``);

console.log(`Komponente erstellt in: ${targetDir}`);
