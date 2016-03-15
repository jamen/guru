import test from 'ava';
import Token from '../lib/token';
import Parser from '../lib/parser';

test('Parsing', t => {
  function foo(reader) {
    if (reader.current() === '0') {
      reader.next();
      this.token('foo', 0);
    }
    return reader;
  }

  function bar(reader) {
    if (reader.current() === '1') {
      reader.next();
      this.token('bar', 1);
    }
    return reader;
  }

  const foobar = new Parser([foo, bar]);

  t.plan(1);

  return foobar.parse('001011').then(() => {
    t.same(foobar.tokens, [
      new Token('foo', 0),
      new Token('foo', 0),
      new Token('bar', 1),
      new Token('foo', 0),
      new Token('bar', 1),
      new Token('bar', 1),
    ]);
  });
});
