import Reader from './reader';
import Token from './token';

export default class BufferReader extends Reader {
  constructor(...args) {
    super(...args);
    this.line = 1;
    this.column = 1;

    this.on('move', this._move);
  }

  grab(...args) {
    return super.grab(...args).toString();
  }

  _move(direction) {
    const cur = this.current();
    if (cur === '\n' || (cur === '\r' && this.lookback() !== '\n')) {
      this.line += direction === 'forward' ? 1 : -1;
      this.column = 1;
    }
  }

  token(...params) {
    this.push(new Token(...params));
  }
}
