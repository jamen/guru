import EventEmitter from 'events';

export default class Reader extends EventEmitter {
  constructor(source, start = 0) {
    super();
    this.source = source;
    this.pos = start;

    // Extra.
    this.line = 1;
    this.column = 1;
  }

  // Get bytes starting from position
  lookahead(amount = 1) {
    return this.source.slice(this.pos, this.pos + amount).toString();
  }

  // Get bytes to the right, starting from position.
  lookback(amount = 1) {
    return this.source.slice(this.pos - amount, this.pos - 1).toString();
  }

  current() { return this.lookahead(); }
  previous() { return this.lookback(); }
  right() { return this.lookahead(-this.pos - 1); }
  left() { return this.lookback(this.pos); }
  peep() { return new Reader(this.right()); }

  // Test bytes against current
  is(chars = []) {
    if (!Array.isArray(chars)) return this.current() === chars;
    return !~chars.indexOf(this.current());
  }

  // Line
  moved(opts = {}) {
    if (this.is('\n') || (this.is('\r') && this.previous() !== '\n')) {
      this.line = this.line + (opts.amount || 1);
      this.column = 0;
    }
    this.column++;

    if (this.pos >= this.source.length) {
      this.emit('end');
    }
  }

  // Move one byte forward
  forward() {
    if (this.pos <= this.source.length - 1) {
      this.pos++;
      this.moved();
    }
    return this;
  }

  // Move one byte backward.
  backward() {
    if (this.pos) {
      this.pos--;
      this.moved({ amount: -1 });
    }
    return this;
  }

  go(direction, amount = 1) {
    if (direction !== 'forth' && direction !== 'back') return null;
    const beginning = this.pos;
    if (typeof amount === 'number') {
      for (let i = 0; i < amount; i++) this[direction]();
    } else if (typeof amount === 'string') {
      while (!this.lookahead(amount)) this[direction]();
    } else if (amount instanceof RegExp) {
      while (!amount.test(this.current())) this[direction]();
    }
    return this.lookback(beginning);
  }
}
