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
    let reader = new (this.reader || BufferReader)(input);
    let writer = new (this.writer || Writer);

    // Kill switch
    reader.on('edge', location => {
      if (location === 'end') this.on = false;
    });

    function loop(parser) {
      return Promise.resolve(parser.rules)
      .then(each(rule => ({ reader, writer } = rule.call(parser, reader, writer))))
      .then(() => {
        if (parser.on) return loop(parser);
        return { result: writer.source, stash: parser.stash };
      });
    }

    return loop(this);
  }

  use(rules) {
    this.rules = this.rules.concat(rules);
    return this;
  }
}
