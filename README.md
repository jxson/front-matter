node-front-matter
=================

http://en.wikipedia.org/wiki/YAML

Extract YAML front matter from strings.

So you have this file `example.md`:

    ---
    title:
    description:
    ---

    This is some content

Then you can do this:

    var frontmatter = require('front-matter')
      , extract = frontmatter(data)


And end up with this:

    console.log(extract)

    { attributes: { title: 'example'
        , description: 'example description'
        }
      , body: '\nThis is some content\n'
    }