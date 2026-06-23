// static-pages/error-404.ts
class PageError404 extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 2rem; text-align: center; }
        h1 { color: #d32f2f; }
      </style>
      <h1>404 - Seite nicht gefunden</h1>
      <p>Tut uns leid, diese Seite existiert nicht.</p>
      <a href="/">Zurück zur Startseite</a>
    `;
  }
}
if (!customElements.get("page-error-404")) {
  customElements.define("page-error-404", PageError404);
}

export default PageError404;
