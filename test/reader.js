import test from 'ava';
import Reader from '../lib/buffer-reader';

const sample = new Buffer('Hello world!');

test('grabbing', t => {
  const foo = new Reader(sample);
  t.is(foo.grab(6, 11), 'world');
});

test.cb('moving', t => {
  const foo = new Reader(sample);
  t.is(foo.current(), 'H');
  foo.forward(2);
  t.is(foo.current(), 'l');
  foo.forward(2);
  t.is(foo.current(), 'o');

  foo.on('move', direction => {
    t.is(direction, 'backward');
    t.end();
  });

  foo.previous();
});

test('looking ahead and back', t => {
  const foo = new Reader(sample);
  foo.forward(4);
  t.is(foo.lookahead(4), 'o wo');
  t.is(foo.lookback(4), 'Hell');
  t.is(foo.current(), 'o');
});

test.cb('edge detection', t => {
  const foo = new Reader(sample);

  foo.on('edge', location => {
    t.is(location, 'end');
    t.end();
  });

  foo.forward(12);
});
