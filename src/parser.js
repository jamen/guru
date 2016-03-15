import BufferReader from './buffer-reader';
import Map from 'es6-map';
import Reader from './reader';
import Token from './token';

export default class Parser {
  constructor(rules = [], output = []) {
    this.rules = rules;
    this._stash = new Map();
    this.output = output;
    this.keepalive = false;
  }

  parse(input) {
    let reader = input;
    if (input instanceof Buffer || typeof input === 'string') {
      reader = new BufferReader(input);
    } else {
      reader = new Reader(input);
    }

    this.keepalive = true;
    reader.on('edge', location => {
      if (location === 'end') this.keepalive = false;
    });

    return new Promise((resolve, reject) => {
      while (this.keepalive) {
        const sp = reader.pos;
        for (const rule of this.rules) {
          rule.call(this, reader);
        }

        if (sp === reader.pos) {
          reject(new Error('No rules could process input'));
          break;
        }
      }
      resolve([this.output, this.stash()]);
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

  push(...params) { return this.output.push(...params); }
  token(...params) { return this.push(new Token(...params)); }
}
