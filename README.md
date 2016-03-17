# Guru
> A fancy, general-purpose, modular, and reusable parser.

Guru is a general purpose parsing library for Node.js, that can take advantage of the modular ecosystem, and rely on a lot of native components to be lightweight.

It uses a `Reader` class to maintain the ability to take abstract input, and the `Parser` class relies on this.  With that in play, the `Parser` can be reused multiple times to parse many different things...  For instance, you can use the same `Parser` class to lex an input, as well as to analyze tokens outputted from your previous parser.

## Installation
```shell
$ npm install --save jamen/guru
```

## Usage
```javascript
import { Parser } from 'guru';
import fs from 'fs-promise';
import { tokenize, transform, resolve } from 'my-lang';

fs.readFile('my-file.txt')
.then(buffer => new Parser(tokenize).parse(buffer))
.then(tokens => new Parser(transform).parse(tokens))
.then(tokens => new Parser(resolve).parse(tokens))
.then(buffer => {
  // ...
});
```

## Credits
| ![jamen][avatar] |
|:---:|
| [Jamen Marzonie][github] |

  [avatar]: https://avatars.githubusercontent.com/u/6251703?v=3&s=125
  [github]: https://github.com/jamen
