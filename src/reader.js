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
  current() { return this.lookahead()[0]; }

  lookback(amount = 1) {
    return this.grab(this.pos - amount, this.pos);
  }

  record() {
    const beginning = this.pos;
    return () => this.grab(...([beginning, this.pos].sort((a, b) => a - b)));
  }

  next() {
    this.emit('move', 'forward');
    this.pos++;

    if (this.pos + 1 > this.source.length) {
      this.emit('edge', 'end');
      return;
    }
  }

  previous() {
    this.emit('move', 'backward');
    this.pos--;

    if (this.pos < 0) {
      this.emit('edge', 'start');
      return;
    }
  }

  forward(amount = 1) {
    switch (amount.constructor) {
      case Number:
        return this.forward(i => amount > i);
      case RegExp:
        return this.forward(() => amount.test(this.current()));
      default:
        return this.forward(() => amount !== this.current());
      case Function:
        return this.until(i => {
          if (!amount(i)) return false;
          this.next();
          return true;
        });
    }
  }

  backward(amount = 1) {
    switch (amount.constructor) {
      case Number:
        return this.backward(i => amount > i);
      case RegExp:
        return this.backward(() => amount.test(this.current()));
      default:
        return this.backward(() => amount !== this.current());
      case Function:
        return this.until(i => {
          if (!amount(i)) return false;
          this.previous();
          return true;
        });
    }
  }

  clone() {
    const FuzzyReader = this.constructor;
    const copy = new FuzzyReader(this.source);
    copy.forward(this.pos);
    return copy;
  }

  until(callback) {
    const capture = this.record();
    let i = 0;
    let keepalive = null;
    do { keepalive = callback(i++); } while (keepalive && this.pos <= this.source.length - 1);
    return capture();
  }

  rtl() {
    this.source = this.source.reverse();
    return this;
  }
}
