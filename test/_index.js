var dsfm = require('./');
var assert = require('assert');
var stream = require('readable-stream');

describe('dsfm()', function () {
  it('should return a Function instance,', function () {
    assert(dsfm('') instanceof Function);
  });
  it('should deal with arbitrary delims,', function () {
    var csfm = new dsfm(',,,', function (data) {
      return data.replace('dash', 'comma');
    });
    var ret = csfm(',,,\ndash-seperated\n,,,\ncontent');
    assert.equal(ret.attributes, 'comma-seperated');
    assert.equal(ret.body, 'content');

    // no newline after closing delim (eos)
    var bsfm = dsfm(['[[[', ']]]'], function (data) {
      return data.replace('dash', 'square-bracket');
    });
    ret = bsfm('[[[\ndash-seperated\n]]]');
    assert.equal(ret.attributes, 'square-bracket-seperated');
    assert.equal(ret.body, '');
  });
  it('even when constructed without a transform', function () {
    var csfm = new dsfm(',,,', null);
    var ret = csfm(',,,\ndata\n,,,\ncontent');
    assert.equal(ret.attributes, 'data');
    assert.equal(ret.body, 'content');
  });
  it('should throw on invalid delims type', function () {
    assert.throws(function () { new dsfm.Parser({}); });
  });
  it('should throw on invalid fn type', function () {
    assert.throws(function () { new dsfm.Parser('', 2); });
  });

  /**
   * testing yaml() and json() is an appropriate
   * test for return values of the parser
   * constructor, given arbitrary args.
   */
  describe('#yaml()', function () {
    it('should correctly parse a document', function () {
      var post = dsfm.yaml('---\ntesting: true\npassing: hopefully\n---\ncontent');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal(post.body, 'content');
    });
    it('should parse a document using dos newlines', function () {
      var post = dsfm.yaml('---\r\ntesting: true\r\npassing: hopefully\r\n---\r\ncontent');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal(post.body, 'content');
    });
    it('should parse a document containing no front-matter', function () {
      var post = dsfm.yaml('content');
      assert.equal(post.attributes, null);
      assert.equal(post.body, 'content');
    });
    it('should parse a document containing only front-matter', function () {
      var post = dsfm.yaml('---\ntesting: true\npassing: hopefully\n---\n');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal(post.body, '');
    });
    it('should parse an empty document', function () {
      var post = dsfm.yaml('');
      assert.equal(post.attributes, null);
      assert.equal(post.body, '');
    });
    describe('#test()', function () {
      it('should test for yaml front-matter in a document', function () {
        var test = dsfm.yaml.test;
        assert(test('---\ntesting: true\npassing: hopefully\n---\ncontent'));
        assert(!test('no-front-matter'));
      });
    });
    describe('#through()', function () {
      var through = dsfm.yaml.through();
      it('should return `through` stream', function () {
        assert(through instanceof stream.Transform);
      });
      it('that emits `attributes` and `data`', function (complete) {
        var attributes;
        var body = '';
        var readable = new stream.Readable({
          read: function () {
            this.push('---\ntesting: true\npassing: hopefully\n---\ncontent');
            this.push(null);
          },
        });
        through.on('attributes', function (attr) {
          attributes = attr;
        });
        through.on('data', function (data) {
          body += data;
        });
        through.on('end', function () {
          assert(attributes, { testing: true, passing: 'hopefully' });
          assert(body, 'content');
          complete();
        });
        readable.pipe(through);
      });
    });
  });

  describe('#json()', function () {
    it('should correctly parse a document', function () {
      var post = dsfm.json('{{{\n"testing":true,"passing":"hopefully"\n}}}\ncontent');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal('content', post.body);
    });
    it('should parse a document using dos newlines', function () {
      var post = dsfm.json('{{{\r\n"testing":true,"passing":"hopefully"\r\n}}}\r\ncontent');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal(post.body, 'content');
    });
    it('should parse a document containing no front-matter', function () {
      var post = dsfm.json('content');
      assert.equal(post.attributes, null);
      assert.equal(post.body, 'content');
    });
    it('should parse a document containing only front-matter', function () {
      var post = dsfm.json('{{{\n"testing":true,"passing":"hopefully"\n}}}\n');
      assert.deepEqual(post.attributes, { testing: true, passing: 'hopefully' });
      assert.equal(post.body, '');
    });
    it('should parse an empty document', function () {
      var post = dsfm.json('');
      assert.equal(post.attributes, null);
      assert.equal(post.body, '');
    });
    describe('#test()', function () {
      it('should test for json front-matter in a document', function () {
        var test = dsfm.json.test;
        assert(test('{{{\n"testing":true,"passing":"hopefully"\n}}}\ncontent'));
        assert(!test('no-front-matter'));
      });
    });
    describe('#through()', function () {
      var through = dsfm.json.through();
      it('should return `through` stream', function () {
        assert(through instanceof stream.Transform);
      });
      it('that emits `attributes` and `data`', function (complete) {
        var attributes;
        var body = '';
        var readable = new stream.Readable({
          read: function () {
            this.push('{{{\n"testing":true,"passing":"hopefully"\n}}}\ncontent');
            this.push(null);
          },
        });
        through.on('attributes', function (attr) {
          attributes = attr;
        });
        through.on('data', function (data) {
          body += data;
        });
        through.on('end', function () {
          assert.deepEqual(attributes, { testing: true, passing: 'hopefully' });
          assert.deepEqual(body, 'content');
          complete();
        });
        readable.pipe(through);
      });
    });
  });
});
