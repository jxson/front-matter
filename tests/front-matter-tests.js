var
  frontmatter = require('../index'),
  fs = require('fs');

module.exports = {
  'parse files' : function ( test ) {
    test.expect( 6 );
    fs.readFile( 'tests/data/test.md', 'utf-8', function ( err, data ) {
      data = frontmatter(data);
      test.ok( data.body, 'Body should be returned' );
      test.ok( data.attributes.title === 'Some Title' );
      test.ok( data.attributes.tags[2] === 'scissors' );
      test.ok( data.attributes.id === 1001 );
      test.ok( data.attributes.nested.attr1[2] === 'c' );
      test.ok( data.attributes.nested.attr3[2] === 'i' );
      test.done();
    });
  },
  'parse invalid data' : function ( test ) {
    test.expect( 4 );
    var
      data1 = frontmatter(''),
      data2 = frontmatter('invalid');
    test.ok( data1.attributes, 'should not have data' );
    test.ok( data1.body === '', 'body should be empty' );
    test.ok( data2.attributes, 'should not have data' );
    test.ok( data2.body === 'invalid', 'should have body if no FM found' );
    test.done();
  }
};
