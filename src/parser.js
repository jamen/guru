import Reader from './reader';
import Grammar from './grammar';

export default class Parser {
  constructor(grammar) {
    this.grammar = grammar || new Grammar();
  }

  parse(input) {
    const reader = new Reader(input);
    const tokens = [];

    let alive = true;
    reader.on('end', () => {
      console.log('Hello world!');
      alive = false;
    });

    let token = null;
    let nomatch = false;
    while (alive) {
      nomatch = false;
      for (const rule of this.grammar.rules) {
        token = rule(reader);
        if (token) tokens.push(token);
      }
      if (nomatch) throw new Error('Hello world');
    }
    return tokens;
  }
}
