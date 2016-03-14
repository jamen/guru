export default class Token {
  constructor(name = 'unknown', value = null, meta = {}) {
    this.name = name;
    this.value = value;
    this.meta = meta;
  }
}
