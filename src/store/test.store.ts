import { Signal } from "./signal";

class TestStore {
  _test = new Signal<string[]>([]);

  add(text: string) {
    this._test.value = [...this._test.value, text];
  }

  reset() {
    this._test.value = [];
  }

  get test(): string[] {
    return this._test.value;
  }
}

export const testStore = new TestStore();
