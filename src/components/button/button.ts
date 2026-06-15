class AppButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Nur das visuelle Template. Keine Logik, keine Events.
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        button {
          padding: var(--app-button-padding, 10px 20px);
          background-color: var(--app-button-bg, blue);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <button>
        <slot></slot>
      </button>
    `;
  }
}

if (!customElements.get("app-button")) {
  customElements.define("app-button", AppButton);
}

export default AppButton;
