// it('parses yaml delinetead by `= yaml =`', function(done){
//   read('yaml-seperator.md', function(err, data){
//     if (err) return done(err)
//
//     var content = fm(data)
//     var body = 'Plays nice with markdown syntax highlighting'
//     var meta = content.attributes // less typing
//
//     assert.ok(meta)
//     assert.equal(meta.title, 'I couldn\'t think of a better name')
//     assert.equal(meta.description, 'Just an example of using `= yaml =`')
//
//     assert.ok(content.body)
//     assert.ok(content.body.match(body))
//
//     done()
//   })
// })
