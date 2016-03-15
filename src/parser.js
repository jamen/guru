import BufferReader from './buffer-reader';
import Map from 'es6-map';
import Token from './token';
import EventEmitter from 'events';

export default class Parser extends EventEmitter {
  constructor(rules = []) {
    super();
    this.rules = rules;
    this._stash = new Map();
    this.tokens = [];
    this.keepalive = false;
  }

  parse(input) {
    let reader = input;
    if (input instanceof Buffer || typeof input === 'string') {
      reader = new BufferReader(input);
    }

    this.keepalive = true;
    reader.on('edge', location => {
      if (location === 'end') this.keepalive = false;
    });

    return new Promise(resolve => {
      let i = 0;
      while (this.keepalive) {
        if (i >= this.rules.length) i = 0;
        this.rules[i].call(this, reader);
        i++;
      }
      resolve([this.tokens, this.stash()]);
    });
  }

  stash(...args) {
    switch (args.length) {
      case 1:
        return this._stash.get(...args);
      case 2:
        return this._stash.set(...args);
      default:
        return this._stash;
    }
  }

  trash(name) { return this._stash.delete(name); }

  use(rules) {
    this.rules = this.rules.concat(rules);
    return this;
  }

  token(...params) {
    this.tokens.push(new Token(...params));
  }
}
