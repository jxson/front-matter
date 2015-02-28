
# front-matter

[![NPM](https://nodei.co/npm/front-matter.png)](https://nodei.co/npm/front-matter/)

## Extract [YAML][yaml] front matter from strings.

[![build status](https://secure.travis-ci.org/jxson/front-matter.png)](http://travis-ci.org/jxson/front-matter)
[![Dependency Status](https://david-dm.org/jxson/front-matter.png)](https://david-dm.org/jxson/front-matter)

This modules does not do any IO (file loading or reading), only extracting yaml front matter from strings.

This concept that was originally introduced to me through the [jeykll][jeykll] blogging system and is pretty useful where you want to be able to easily add metadata to content without the need for a database. YAML is extracted from the the top of a file between matching separators of "---" or "= yaml =".

<!-- This is part of a long running project I have been working on where I am splitting out internals of [haiku][haiku] into to separate, more useful and shareable modules. If your in need of a static site generator [check it out][haiku]. -->

# Install

With [npm][npm] do:

    npm install front-matter

# Example

So you have a file `example.md`:

    ---
    title: Just hack'n
    description: Nothing to see here
    ---

    This is some text about some stuff that happened sometime ago

Then you can do this:

    var fs = require('fs')
      , fm = require('front-matter')

    fs.readFile('./example.md', 'utf8', function(err, data){
      if (err) throw err

      var content = fm(data)

      console.log(content)
    })

And end up with an object like this:

    { attributes: { title: 'Just hack\'n'
      , description: 'Nothing to see here'
      }
    , body: 'This is some text about some stuff that happened sometime ago'
    }

# Methods

    var fm = require('front-matter')

## fm(string)

Return a `content` object with two properties:

* `content.attributes` contains the extracted yaml attributes in json form
* `content.body` contains the string contents below the yaml separators

# fm.test(string)

Check if a string contains a front matter header of "---" or "= yaml =". Primarily used internally but is useful outside of the module.

Returns `true` or `false`

    fm.test(string) #=> true || false

# Contributing

front-matter is an OPEN Source Project so please help out by [reporting bugs](http://github.com/jxson/front-matter/issues) or [forking and opening pull](https://github.com/jxson/front-matter) requests when possible.

### Contributors

This module is awesome beacuse of all the folks who helped out:

* **Jason Campbell**: [github](https://github.com/jxson) - [twitter](https://twitter.com/jxson)
* **Jordan Santell**: [github](https://github.com/jsantell) - [twitter](https://twitter.com/jsantell)
* **Kai Davenport**: [github](https://github.com/binocarlos)
* **Jean-Philippe Monette**: [github](https://github.com/jpmonette) - [twitter](https://twitter.com/jpmonette)
* **Marc-André Arseneault**: [github](https://github.com/arsnl) - [twitter](https://twitter.com/im_arsnl)
* **Bret Comnes**: [github](https://github.com/bcomnes) - [bret.io](http://bret.io)
* **Shinnosuke Watanabe**: [github](https://github.com/shinnn)

# LICENSE (MIT)

Copyright (c) Jason Campbell ("Author")

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[yaml]: http://en.wikipedia.org/wiki/YAML
[haiku]: http://haiku.io
[npm]: http://npmjs.org
[jeykll]: https://github.com/mojombo/jekyll
