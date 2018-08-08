export default class Cat {
  constructor() {
    this._name = 'Cat';
    this._sound = 'meow';
  }
  get name() {
    return this._name;
  }
  get sound() {
    return this._sound;
  }
}
