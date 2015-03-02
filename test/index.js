
var fm = require('../')
var fs = require('fs')
var path = require('path')
var test = require('tape')

test('var fm = require("front-matter")', function(t) {
  var fm = require('../')
  t.equal(typeof fm, 'function')
  t.end()
})

test('fm(string) - parse yaml delinetead by `---`', function(t) {
  read('dashes-seperator.md', function(err, data){
    t.error(err, 'read(...) should not error')

    var content = fm(data)

    t.ok(content.attributes, 'should have `attributes` key')
    t.equal(content.attributes.title, 'Three dashes marks the spot')
    t.equal(content.attributes.tags.length, 3)

    t.ok(content.body, 'should have a `body` key')
    t.ok(content.body.match('don\'t break'), 'should match body')
    t.ok(content.body.match('---'), 'should match body')
    t.ok(content.body.match('Also this shouldn\'t be a problem'),
      'should match body')

    t.end()
  })
})

test('fm(string) - parse yaml delinetead by `= yaml =`', function(t) {
  read('yaml-seperator.md', function(err, data){
    t.error(err, 'read(...) should not error')

    var content = fm(data)
    var meta = content.attributes
    var body = content.body

    t.equal(meta.title, 'I couldn\'t think of a better name')
    t.equal(meta.description, 'Just an example of using `= yaml =`')
    t.ok(body.match('Plays nice with markdown syntax highlighting'),
      'should match body')

    t.end()
  })
})

test('fm(string) - string missing front-matter', function(t) {
  var content = fm('No front matter here')

  t.equal(content.body, 'No front matter here')
  t.end()
})

test('fm(string) - string missing body', function(t) {
  read('missing-body.md', function(err, data){
    t.error(err, 'read(...) should not error')

    var content = fm(data)

    t.equal(content.attributes.title, 'Three dashes marks the spot')
    t.equal(content.attributes.tags.length, 3)
    t.equal(content.body, '')
    t.end()
  })
})

test('fm(string) - wrapped test in yaml', function(t) {
  read('wrapped-text.md', function(err, data){
    t.error(err, 'read(...) should not error')

    var content = fm(data)
    var folded = [ 'There once was a man from Darjeeling'
        , 'Who got on a bus bound for Ealing'
        , '    It said on the door'
        , '    "Please don\'t spit on the floor"'
        , 'So he carefully spat on the ceiling\n'
        ].join('\n')

    t.equal(content.attributes['folded-text'], folded)
    t.ok(content.body.match('Some crazy stuff going on up there'),
      'should match body')

    t.end()
  })
})

test('fm(string) - strings with byte order mark', function(t) {
  read('bom.md', function(err, data){
    t.error(err, 'read(...) should not error')

    var content = fm(data)

    t.equal(content.attributes.title, "Relax guy, I'm not hiding any BOMs")

    t.end()
  })
})

test('fm.test(string) - yaml seperator', function(t) {
  read('yaml-seperator.md', function(err, data) {
    t.error(err, 'read(...) should not error')
    t.equal(fm.test(data), true)
    t.end()
  })
})

test('fm.test(string) - dashes seperator', function(t) {
  read('dashes-seperator.md', function(err, data) {
    t.error(err, 'read(...) should not error')
    t.equal(fm.test(data), true)
    t.end()
  })
})

test('fm.test(string) - no front-matter', function(t) {
  t.equal(fm.test('no front matter here'), false)
  t.end()
})

function read(file, callback){
  var dir =  path.resolve(__dirname, '../examples')
    , file = path.join(dir, file)

  fs.readFile(file, 'utf8', callback)
}
