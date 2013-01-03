
var assert = require('assert')
  , fm = require('../')
  , fs = require('fs')
  , path = require('path')

describe('fm(string)', function(){
  it('parses yaml delinetead by `---`', function(done){
    read('dashes.md', function(err, data){
      if (err) return done(err)

      var content = fm(data)

      assert.equal(typeof content, 'object')
      assert.equal(typeof content.attributes, 'object')
      assert.equal(content.body, [''
      , 'don\'t break'
      , ''
      , '---'
      , ''
      , 'ALso this shouldn\'t be a problem'
      , ''
      ].join('\n'))
      assert.equal(content.attributes.title, 'Three dashes marks the spot')
      assert.equal(content.attributes.tags.length, 3)

      done()
    })
  })

  it('parses yaml delinetead by `= yaml =`', function(done){
    read('yaml-seperator.md', function(err, data){
      if (err) return done(err)

      var content = fm(data)

      assert.equal(typeof content, 'object')
      assert.equal(typeof content.attributes, 'object')
      assert.equal(content.body, [''
      , 'Plays nice with markdown syntax highlighting'
      , ''].join('\n'))
      assert.equal(content.attributes.title, 'I couldn\'t think of a '
      + 'better name')
      assert.equal(content.attributes.description, 'Just an example of '
      + 'using `= yaml =`')

      done()
    })
  })

  describe('when there is NOT front matter', function(){
    var body = 'No front matter here'
      , content

    before(function(){
      content = fm(body)
    })

    it('has an empty `content.yaml` object', function(){
      assert.equal(typeof content.attributes, 'object')
      assert.equal(Object.keys(content.attributes).length, 0)
    })

    it('populates `content.body`', function(){
      assert.equal(content.body, body)
    })
  })
})

function read(file, callback){
  var dir =  path.resolve(__dirname)
    , file = path.join(dir, file)

  fs.readFile(file, 'utf8', callback)
}
