
const fm = require('../')
const fs = require('fs')
const path = require('path')
const assert = require('assert')

describe('fm(string)', function(){
  it('parses yaml delinetead by `---`', function(done){
    read('dashes-seperator.md', function(err, data){
      if (err) return done(err)

      var content = fm(data)
      var body = [ 'don\'t break'
          , '---'
          , 'Also this shouldn\'t be a problem'
          ].join('\n\n')

      assert.ok(content.attributes)
      assert.equal(content.attributes.title, 'Three dashes marks the spot')
      assert.equal(content.attributes.tags.length, 3)

      // it's a pita to match line breaks exactly
      assert.ok(content.body)
      assert.ok(content.body.match(body))

      done()
    })
  })

  it('parses yaml delinetead by `= yaml =`', function(done){
    read('yaml-seperator.md', function(err, data){
      if (err) return done(err)

      var content = fm(data)
      var body = 'Plays nice with markdown syntax highlighting'
      var meta = content.attributes // less typing

      assert.ok(meta)
      assert.equal(meta.title, 'I couldn\'t think of a better name')
      assert.equal(meta.description, 'Just an example of using `= yaml =`')

      assert.ok(content.body)
      assert.ok(content.body.match(body))

      done()
    })
  })

  it('works on strings missing front-matter', function(){
    var body = 'No front matter here'
      , content = fm(body)

    assert.ok(content.attributes)
    assert.equal(content.body, body)
  })

  it('works on strings missing body', function(done){
    read('missing-body.md', function(err, data){
      if (err) return done(err)

      var content = fm(data)

      assert.ok(content.attributes)
      assert.equal(content.attributes.title, 'Three dashes marks the spot')
      assert.equal(content.attributes.tags.length, 3)

      // it's a pita to match line breaks exactly
      assert.equal(content.body, '')

      done()
    })
  })

  it('parses wrapped text in yaml properly', function(done){
    read('wrapped-text.md', function(err, data){
      if (err) return done(err)

      var content = fm(data)
      var body = '\nSome crazy stuff going on up there ^^\n'
      var folded = [ 'There once was a man from Darjeeling'
          , 'Who got on a bus bound for Ealing'
          , '    It said on the door'
          , '    "Please don\'t spit on the floor"'
          , 'So he carefully spat on the ceiling\n'
          ].join('\n')

      assert.ok(content.attributes)
      assert.equal(content.attributes['folded-text'], folded)

      assert.equal(content.body, body)

      done()
    })
  })
})

function read(file, callback){
  var dir =  path.resolve(__dirname, '../examples')
    , file = path.join(dir, file)

  fs.readFile(file, 'utf8', callback)
}
