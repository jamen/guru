import Reader from './reader';

export default class ASTReader extends Reader {
  open(meta = this.meta) {
    return new ASTReader(this.current().children, Object.assign({ parent: this }, meta));
  }

  leave() {
    return this.meta.parent;
  }
}
