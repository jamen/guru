import EventEmitter from 'events';

export default class Reader extends EventEmitter {
  constructor(source = [], meta = {}) {
    super();
    this.source = source;
    this.meta = meta;
    this.pos = 0;
  }

  grab(p1, p2) { return this.source.slice(p1, p2); }

  lookahead(amount = 1) {
    return this.grab(this.pos, this.pos + amount);
  }
  current() { return this.lookahead(); }

  lookback(amount = 1) {
    return this.grab(this.pos - amount, this.pos);
  }

  next() {
    if (this.pos >= this.source.length - 1) {
      this.emit('edge', 'end');
      return;
    }

    this.emit('move', 'forward');
    this.pos++;
  }

  previous() {
    if (this.pos - 1 < 0) {
      this.emit('edge', 'start');
      return;
    }

    this.emit('move', 'backward');
    this.pos--;
  }

  forward(amount = 1) { for (let i = 0; i < amount; i++) this.next(); }
  backward(amount = 1) { for (let i = 0; i < amount; i++) this.previous(); }

  mini() {
    const FlexibleReader = this.constructor;
    return new FlexibleReader(this.lookahead(this.source.length - this.pos - 1));
  }
}
