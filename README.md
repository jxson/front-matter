# front-matter

Extract [YAML][yaml] front matter from strings. If your familiar with
jeykl then you know what's up.

This is part of a long running project I have been working on where I
am spinning out all it's internals to separate, more useful modules.
If your in need of a static site generator check out [haiku][haiku].

## Example

So you have a file `example.md`:

    ---
    title: Just hack'n
    description: Nothing to see here
    ---

    This is some content about some stuff that happened sometime ago

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

## var content = fm(string)

Return a `content` object with two properties:

* `content.yaml` contains the extracted yaml attributes in json form
* `content.body` contains the string contents below the yaml fold

## Install

With [npm][npm] do:

    npm install front-matter

# License

MIT

[yaml]: http://en.wikipedia.org/wiki/YAML
[haiku]: http://haiku.io
[npm]: http://npmjs.org