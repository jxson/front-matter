var fm = require('../')
var fs = require('fs')
var path = require('path')
var test = require('tape')

test('var fm = require("front-matter")', function (t) {
  t.equal(typeof fm, 'function')
  t.end()
})

test('fm(string) - parse yaml delinetead by `---`', function (t) {
  read('dashes-seperator.md', function (err, data) {
    t.error(err, 'read(...) should not error')

    var content = fm(data)

    t.ok(content.attributes, 'should have `attributes` key')
    t.equal(content.attributes.title, 'Three dashes marks the spot')
    t.equal(content.attributes.tags.length, 3)

    t.ok(content.body, 'should have a `body` key')
    t.ok(content.body.match("don't break"), 'should match body')
    t.ok(content.body.match('---'), 'should match body')
    t.ok(content.body.match("Also this shouldn't be a problem"),
      'should match body')

    t.end()
  })
})

test('fm(string) - parse yaml delinetead by `= yaml =`', function (t) {
  read('yaml-seperator.md', function (err, data) {
    t.error(err, 'read(...) should not error')

    var content = fm(data)
    var meta = content.attributes
    var body = content.body

    t.equal(meta.title, "I couldn't think of a better name")
    t.equal(meta.description, 'Just an example of using `= yaml =`')
    t.ok(body.match('Plays nice with markdown syntax highlighting'),
      'should match body')

    t.end()
  })
})

test('fm(string) - parse yaml ended by `...`', function (t) {
  read('dots-ending.md', function (err, data) {
    t.error(err, 'read(...) should not error')

    var content = fm(data)
    var meta = content.attributes
    var body = content.body

    t.equal(meta.title, 'Example with dots document ending')
    t.equal(meta.description, 'Just an example of using `...`')
    t.ok(body.match("It shouldn't break with ..."),
      'should match body')

    t.end()
  })
})

test('fm(string) - string missing front-matter', function (t) {
  var content = fm('No front matter here')

  t.equal(content.body, 'No front matter here')
  t.end()
})

test('fm(string) - string missing body', function (t) {
  read('missing-body.md', function (err, data) {
    t.error(err, 'read(...) should not error')

    var content = fm(data)

    t.equal(content.attributes.title, 'Three dashes marks the spot')
    t.equal(content.attributes.tags.length, 3)
    t.equal(content.body, '')
    t.end()
  })
})

test('fm(string) - wrapped test in yaml', function (t) {
  read('wrapped-text.md', function (err, data) {
    t.error(err, 'read(...) should not error')

    var content = fm(data)
    var folded = [
      'There once was a man from Darjeeling',
      'Who got on a bus bound for Ealing',
      '    It said on the door',
      '    "Please don\'t spit on the floor"',
      'So he carefully spat on the ceiling\n'
    ].join('\n')

    t.equal(content.attributes['folded-text'], folded)
    t.ok(content.body.match('Some crazy stuff going on up there'),
      'should match body')

    t.end()
  })
})

test('fm(string) - strings with byte order mark', function (t) {
  read('bom.md', function (err, data) {
    t.error(err, 'read(...) should not error')

    var content = fm(data)

    t.equal(content.attributes.title, "Relax guy, I'm not hiding any BOMs")

    t.end()
  })
})

test('fm(string) - no front matter, markdown with hr', function (t) {
  read('no-front-matter.md', function (err, data) {
    t.error(err, 'read should not error')

    var content = fm(data)
    t.equal(content.body, data)
    t.end()
  })
})

test('fm(string) - complex yaml', function (t) {
  read('complex-yaml.md', function (err, data) {
    t.error(err, 'read(...) should not error')
    var content = fm(data)
    t.ok(content.attributes, 'should have `attributes` key')
    t.equal(content.attributes.title, 'This is a title!')
    t.equal(content.attributes.contact, null)
    t.equal(content.attributes.match.toString(), '/pattern/gim')
    t.equal(typeof content.attributes.run, 'function')
    t.end()
  })
})

test('fm.test(string) - yaml seperator', function (t) {
  read('yaml-seperator.md', function (err, data) {
    t.error(err, 'read(...) should not error')
    t.equal(fm.test(data), true)
    t.end()
  })
})

test('fm.test(string) - dashes seperator', function (t) {
  read('dashes-seperator.md', function (err, data) {
    t.error(err, 'read(...) should not error')
    t.equal(fm.test(data), true)
    t.end()
  })
})

test('fm.test(string) - no front-matter', function (t) {
  t.equal(fm.test('no front matter here'), false)
  t.end()
})

test('Supports live updating', function (t) {
  var seperator = '---'
  var string = ''
  for (var i = 0; i < seperator.length; i++) {
    string += seperator[i]

    try {
      fm(string)
    } catch (e) {
      t.error(e)
    }
  }

  string += '\n'
  string += 'foo: bar'

  var content = fm(string)

  t.same(content, {
    attributes: {},
    body: string
  })

  string += '\n---\n'
  content = fm(string)
  t.same(content, {
    attributes: { foo: 'bar' },
    body: ''
  })

  t.end()
})

test('fm.stringify(obj) - stringify yaml without front-matter', function (t) {
  var data = 'no front matter here'
  var obj = { attributes: {}, body: data }
  t.equal(fm.stringify(obj), 'no front matter here', 'fm.stringify(obj) should equal data')
  t.end()
})

test('fm.stringify(obj) - stringify yaml delinetead by `---`', function (t) {
  read('dashes-seperator.md', function (err, data) {
    t.error(err, 'read(...) should not error')
    t.equal(fm.stringify(fm(data)), data, 'fm.stringify(fm(data)) should equal data')

    t.end()
  })
})

test('fm.stringify(obj) - stringify yaml delinetead by `= yaml =`', function (t) {
  read('dashes-seperator.md', function (err, data) {
    t.error(err, 'read(...) should not error')
    t.ok(fm.stringify(fm(data), { scope: '= yaml =' }).match(/^= yaml =\s/), 'should begain with = yaml =')

    t.end()
  })
})

function read (relative, callback) {
  var directory = path.resolve(__dirname, '../examples')
  var resolved = path.join(directory, relative)

  fs.readFile(resolved, 'utf8', callback)
}
