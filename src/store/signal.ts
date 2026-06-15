export class Signal<T> {
  private _value: T;
  private subscribers = new Set<() => void>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.subscribers.forEach((fn) => fn());
    }
  }

  subscribe(fn: () => void): () => void {
    this.subscribers.add(fn);
    // Rückgabe der Unsubscribe-Funktion
    return () => this.subscribers.delete(fn);
  }
}
