import test from 'ava';
import Writer from '../lib/writer';

test('ast', t => {
  const foo = new Writer();

  // Write
  foo.write('foo');

  // Create nest and write
  foo.nest().write('bar');

  // Create nest, write, zoom out, write again
  foo.nest().write('baz').parent().write('qux');

  t.same(foo.source, ['foo', { children: ['bar'] }, { children: ['baz'] }, 'qux']);
});
