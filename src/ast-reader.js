import Reader from './reader';

export default class ASTReader extends Reader {
  inspect() {
    return new ASTReader(this.current().children, Object.assign({ parent: this }, this.meta));
  }

  leave() {
    return this.meta.parent;
  }
}
