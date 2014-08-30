
var fm = require('../')
var path = require('path')
var test = require('prova')
var fixtures = require('./fixtures')

test('empty string', function(t) {

})

//   it('works on strings missing front-matter', function(){
//     var body = 'No front matter here'
//       , content = fm(body)
//
//     assert.ok(content.attributes)
//     assert.equal(content.body, body)
//   })
//
//   it('works on strings missing body', function(done){
//     read('missing-body.md', function(err, data){
//       if (err) return done(err)
//
//       var content = fm(data)
//
//       assert.ok(content.attributes)
//       assert.equal(content.attributes.title, 'Three dashes marks the spot')
//       assert.equal(content.attributes.tags.length, 3)
//
//       // it's a pita to match line breaks exactly
//       assert.equal(content.body, '')
//
//       done()
//     })
//   })
//
//   it('parses wrapped text in yaml properly', function(done){
//     read('wrapped-text.md', function(err, data){
//       if (err) return done(err)
//
//       var content = fm(data)
//       var body = '\nSome crazy stuff going on up there ^^\n'
//       var folded = [ 'There once was a man from Darjeeling'
//           , 'Who got on a bus bound for Ealing'
//           , '    It said on the door'
//           , '    "Please don\'t spit on the floor"'
//           , 'So he carefully spat on the ceiling\n'
//           ].join('\n')
//
//       assert.ok(content.attributes)
//       assert.equal(content.attributes['folded-text'], folded)
//
//       assert.equal(content.body, body)
//
//       done()
//     })
//   })
// })
//
// function read(file, callback){
//   var dir =  path.resolve(__dirname, '../examples')
//     , file = path.join(dir, file)
//
//   fs.readFile(file, 'utf8', callback)
// }
