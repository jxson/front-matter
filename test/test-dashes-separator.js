
var fixtures = require('./fixtures.json')
  , test = require('prova')
  , fm = require('../')

test('parses yaml delineated by `---`', function(assert) {
  var string = fixtures['dashes-separator']
    , content = fm(string)
    , meta = content.attributes
    , body = content.body

  assert.equal(meta.title, 'Three dashes marks the spot')

  assert.equal(meta.tags.length, 3)
  assert.ok(meta.tags.indexOf('yaml') + 1, 'should have "yaml" tag')
  assert.ok(meta.tags.indexOf('front-matter'), 'should have "front-matter" tag')
  assert.ok(meta.tags.indexOf('dashes'), 'should have "dashes" tag')

  assert.equal(meta['expaned-description'], 'with some --- crazy stuff in it')

  console.log('body', body)

  assert.ok('body'.match("don't break"))
  // assert.ok('body'.match('---'))
  // assert.ok('body'.match('Also this shouldn\'t be a problem'))


  assert.end()
})


//     assert.ok(content.body)
//     assert.ok(content.body.match(body))
//
//     done()
//   })
// })

// ---
// title: Three dashes marks the spot
// tags:
//   - yaml
//   - front-matter
//   - dashes
// expaned-description: with some --- crazy stuff in it
// ---
//
// don't break
//
// ---
//
// Also this shouldn't be a problem
