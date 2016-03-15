Getting Started
===============
Guru is a general purpose parser that provides an easy to work with top-level API.  Because Guru is completely pluggable, you define very basic rules on how to manipulate input, Guru has no preconceived rules except that it reads left-to-right, the rest is up to you.

## Core Concepts
Guru uses 3 custom classes internally: [Parser](PARSER.md), [Reader](READER.md), and [Token](TOKEN.md), in addition to the native `Promise` and `Buffer` classes.  You may also here the term "[rules](RULES.md)", these are simply native JavaScript functions that get passed a `Reader` class.

### Reader
The [`Reader`](READER.md) is a simple linear navigator (navigates over iterable objects).  These are the heart of the parsing process, and it's how you actually read and interpret input.

For instance, we can create an array and pass it into a `Reader`, then navigate that array with various methods:
```javascript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const reader = new Reader(data);

const capture = reader.forward(3);
// -> [1, 2, 3]

const advCapture = reader.until(i => i - 3 + reader.pos === 4);
// -> [4, 5, 6, 7]
```
(See [`Reader`'s API](api/Reader.md) docs for more)

There is a more special class, that extends `Reader`, named `BufferReader`...  This adds some sugarcoat functionality so you can compare and test with strings while Reader uses the `Buffer` internally.

### Parser
The `Parser` is a collection [rules](RULES.md) (JavaScript functions) that takes an input (like a `Buffer`), wraps it in a `Reader`, and then lets each rule manipulate the `Reader` instance...  This creates a infinite pipeline of ruling, until the input is eventually fully read.

```javascript
import { Parser } from 'guru';

// Import rules
import { whitespace, integers, strings } from 'guru-common/lexing';

// Load rules into parser
const foo = new Parser([whitespace, integers, strings]);

// Parse with rules
const tokens = foo.parse('123 "Hello" 456');
```
(Note: this example does not work, as guru-common is not finished, but it is what the API would look like in practice)

Parses also have a stash, which you can use with the `.stash()` function:
```
foo.stash('hello', 'world');
const data = foo.stash('hello');
// -> 'world'

// Delete
foo.trash('hello');
```

### Token
A [`Token`](TOKEN.md) is a very **very** simple object, that simply contains a name, value, and meta options:
```javascript
import { Token } from 'guru';

const mytok = new Token('foo', 123, { meta: 'data' });
```
You create tokens from lexing a source, where they can be passed through another parser to be interpreted again.

### Rules
A [rule](RULES.md) is a piece of a [`Parser`](PARSER.md) that handles one specific operation (like turning `\n`, `\r\n` or `\r` into a whitespace `Token`).  Rules have access to a reader and parser (typically):

```javascript
const myLanguage = new Parser([
  function(reader) {
    // this = parser
    const name = this.mini().forward(' ');
    if (/[A-z]/.test(name)) {
      this.stash('name', name);
      reader.forward(name.length);
    }
  }
])
```
