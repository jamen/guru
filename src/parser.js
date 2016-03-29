import Map from 'es6-map';
import BufferReader from './buffer-reader';
import Writer from './writer';
import each from 'promise-each';

export default class Parser {
  constructor(rules = [], options = {}) {
    this.rules = rules;
    this.stash = new Map();
    this.on = false;
    this.meta = options.meta;
    this.reader = options.reader;
    this.writer = options.writer;
  }

  parse(input) {
    this.on = true;
    const reader = new (this.reader || BufferReader)(input);
    const writer = new (this.writer || Writer);

    // Kill switch
    reader.on('edge', location => {
      if (location === 'end') this.on = false;
    });

    return this._ruleLoop(reader, writer);
  }

  use(rules) {
    this.rules = this.rules.concat(rules);
    return this;
  }

  _ruleLoop(reader, writer) {
    return Promise.resolve(this.rules)
    .then(each(rule => rule(reader, writer)))
    .then(() => {
      if (this.on) return this._ruleLoop(reader, writer);
      return { result: writer.source, stash: this.stash };
    });
  }
}
