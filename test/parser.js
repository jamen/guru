import test from 'ava';
import Grammar from '../lib/grammar';
import Token from '../lib/token';
import Parser from '../lib/parser';

test('Parsing', t => {
  const lang = new Grammar([
    r => {
      if (r.is('a')) {
        r.forth();
        return new Token('alpha', 'a');
      }
      return null;
    },

    r => {
      if (r.is('b')) {
        r.forth();
        return new Token('beta', 'b');
      }
      return null;
    },
  ]);

  const foo = new Parser(lang);

  console.log(foo.parse('aababb'));
});
