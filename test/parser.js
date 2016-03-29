import test from 'ava';
import Parser from '../lib/parser';

test('stashing', t => {
  const foo = new Parser();

  foo.stash.set('hello', 'world');
  t.is(foo.stash.get('hello'), 'world');
  foo.stash.delete('hello');
  t.is(typeof foo.stash.get('hello'), 'undefined');
});

test('parsing', t => {
  function foo(reader, writer) {
    if (reader.current() === '0') {
      reader.next();
      writer.write({ name: 'foo', value: 0 });
    }
    return reader;
  }

  function bar(reader, writer) {
    if (reader.current() === '1') {
      reader.next();
      writer.write({ name: 'bar', value: 1 });
    }
    return reader;
  }

  const foobar = new Parser([foo, bar]);

  t.plan(1);
  return foobar.parse('001011').then(({ result }) => {
    t.same(result, [
      { name: 'foo', value: 0 },
      { name: 'foo', value: 0 },
      { name: 'bar', value: 1 },
      { name: 'foo', value: 0 },
      { name: 'bar', value: 1 },
      { name: 'bar', value: 1 },
    ]);
  });
});
