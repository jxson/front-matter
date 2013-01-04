
var fm = require('../')
  , fs = require('fs')
  , path = require('path')
  , chai = require('chai')
  , assert = chai.assert

chai.use(fmAsserts)

describe('fm(string)', function(){
  it('parses yaml delinetead by `---`', function(done){
    read('dashes-seperator.md', function(err, data){
      if (err) return done(err)

      var content = fm(data)
        , body = '\ndon\'t break\n\n'
          + '---\n\n'
          + 'ALso this shouldn\'t be a problem\n'

      assert.validExtraction(content)
      assert.hasBody(content, body)
      assert.propertyVal(content.attributes
      , 'title'
      , 'Three dashes marks the spot')
      assert.property(content.attributes, 'tags')
      assert.lengthOf(content.attributes.tags, 3)

      done()
    })
  })

  it('parses yaml delinetead by `= yaml =`', function(done){
    read('yaml-seperator.md', function(err, data){
      if (err) return done(err)

      var content = fm(data)
        , body = '\nPlays nice with markdown syntax highlighting\n'

      assert.validExtraction(content)
      assert.hasBody(content, body)
      assert.propertyVal(content.attributes
      , 'title'
      , 'I couldn\'t think of a better name')
      assert.propertyVal(content.attributes
      , 'description'
      , 'Just an example of using `= yaml =`')

      done()
    })
  })

  it('works on strings missing front-matter', function(){
    var body = 'No front matter here'
      , content = fm(body)

    assert.validExtraction(content)
    assert.hasBody(content, body)
    assert.lengthOf(Object.keys(content.attributes), 0)
  })

  it('parses wrapped text in yaml prperly', function(done){
    read('wrapped-text.md', function(err, data){
      if (err) return done(err)

      var content = fm(data)
        , body = '\nSome crazy stuff going on up there ^^\n'
        , foldedText = 'There once was a man from Darjeeling\n'
          + 'Who got on a bus bound for Ealing\n'
          + '    It said on the door\n'
          + '    "Please don\'t spit on the floor"\n'
          + 'So he carefully spat on the ceiling\n'

      assert.validExtraction(content)
      assert.hasBody(content, body)
      assert.propertyVal(content.attributes
      , 'folded-text'
      , foldedText)

      done()
    })
  })
})

function read(file, callback){
  var dir =  path.resolve(__dirname, '../examples')
    , file = path.join(dir, file)

  fs.readFile(file, 'utf8', callback)
}

function fmAsserts(chai, utils){
  var Assertion = chai.Assertion
    , assert = chai.assert

  Assertion.includeStack = true

  Assertion.addMethod('validExtraction', function(extraction, message){
    assert.isObject(content)

    assert.property(extraction, 'attributes')
    assert.isObject(extraction.attributes)

    assert.property(extraction, 'body')
    assert.isString(extraction.body)
  })

  assert.validExtraction = function(extraction, message){
    new Assertion(extraction, message).is['validExtraction']
  }

  assert.hasBody = function(extraction, body, message){
    assert.property(extraction, 'body')
    assert.isString(extraction.body)
    assert.propertyVal(extraction, 'body', body)
  }
}

