[![build status](https://secure.travis-ci.org/jxson/front-matter.png)](http://travis-ci.org/jxson/front-matter)

# front-matter

Extract [YAML][yaml] front matter from strings.

This modules does not do any IO (file loading or reading), only extracting yaml front matter from strings.

This concept that was originally introduced to me through the [jeykll][jeykll] blogging system and is pretty useful where you want to be able to easily add metadata to content without the need for a database. YAML is extracted from the the top of a file between matching separators of "---" or "= yaml =".

<!-- This is part of a long running project I have been working on where I am splitting out internals of [haiku][haiku] into to separate, more useful and shareable modules. If your in need of a static site generator [check it out][haiku]. -->

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
    , body: 'This is some content'
    }

# Methods

    var fm = require('front-matter')

## fm(string)

Return a `content` object with two properties:

* `content.attributes` contains the extracted yaml attributes in json form
* `content.body` contains the string contents below the yaml separators

## Install

With [npm][npm] do:

    npm install front-matter

# License

MIT

[yaml]: http://en.wikipedia.org/wiki/YAML
[haiku]: http://haiku.io
[npm]: http://npmjs.org
[jeykll]: https://github.com/mojombo/jekyll