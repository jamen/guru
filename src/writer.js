export default class Writer {
  constructor(meta = {}) {
    this.source = [];
    this.pos = 0;
    this.meta = meta;
  }

  write(item) {
    this.source[this.pos] = item;
    this.pos++;
    return this;
  }

  nest(options, meta = {}) {
    const tree = Object.assign({}, options);
    const child = new Writer(Object.assign({ parent: this }, meta));
    tree.children = child.source;
    this.write(tree);
    return child;
  }

  parent() {
    return this.meta.parent || null;
  }
}
