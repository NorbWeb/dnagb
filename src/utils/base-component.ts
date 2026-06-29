// utils/component.ts
export class Component extends HTMLElement {
  private _unsubs: (() => void)[] = [];
  private _watchQueue: Array<[any, () => void]> = [];

  constructor(shadowMode: "open" | "closed" = "open") {
    super();
    // Shadow DOM automatisch erstellen, wenn die Komponente erzeugt wird
    this.attachShadow({ mode: shadowMode });
    const Ctor = this.constructor as any;

    // 1. Template-Handling: Erstelle das Template-Objekt einmalig aus dem String
    if (Ctor.html) {
      const template = document.createElement("template");
      template.innerHTML = Ctor.html;
      this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    // 2. Style-Handling
    if (Ctor.styles) {
      const styleElement = document.createElement("style");
      styleElement.textContent = Ctor.styles;
      this.shadowRoot?.appendChild(styleElement);
    }
  }

  static get observedAttributes() {
    // Hier erlauben wir Kind-Klassen, eigene Attribute zu definieren
    return (this as any).watchedAttributes || [];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();

      // Optional: Spezifische Setter aufrufen, falls definiert
      const setterName = `on${name.charAt(0).toUpperCase() + name.slice(1)}Change`;
      if (typeof (this as any)[setterName] === "function") {
        (this as any)[setterName](newValue);
      }
    }
  }

  protected watch(signal: any, callback?: () => void) {
    const cb = callback ? callback : () => this.render();

    if (this.isConnected) {
      this._unsubs.push(signal.subscribe(cb));
      cb(); // Initialer Aufruf
    } else {
      this._watchQueue.push([signal, cb]);
    }
  }

  connectedCallback() {
    // Queue abarbeiten, sobald die Komponente im DOM ist
    for (const [signal, callback] of this._watchQueue) {
      this._unsubs.push(signal.subscribe(callback));
      callback();
    }
    this._watchQueue = [];

    // Basis-Render beim ersten Anzeigen
    this.render();
  }

  disconnectedCallback() {
    // Alle Abonnements sauber beenden
    this._unsubs.forEach((unsub) => unsub());
    this._unsubs = [];

    // Optionaler Hook für Kind-Klassen, falls nötig
    if ((this as any).onDestroy) (this as any).onDestroy();
  }

  render() {
    // Kann von Kind-Klassen überschrieben werden
  }
}
