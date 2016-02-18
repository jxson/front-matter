/**
 * Originally from dsfm, dumping this here
 * while i update the v3 branch
 *
 * Module dependancies
 */
var stream = require('readable-stream');
var yaml = require('js-yaml');

/**
 * Constructs new front-matter parser
 * given delimiter(s) and an optional
 * function to transform the extracted
 * front-matter
 *
 * @param {String|Array} delims
 * @param {Function} [fn]
 * @return {Function} new parser
 */
function parser(delims, fn) {
  fn = fn || noop;
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  var arr = Array.isArray(delims);
  if (!arr && typeof delims !== 'string') {
    throw new TypeError('delims must be a string or array');
  } else if (!arr) {
    delims = [delims];
  } else if (!delims.length) {
    throw new Error('delims cannot be an empty array');
  }

  // compile opening `o` and closing `c` RegExps
  var o = new RegExp('^\uFEFF?' + escape(delims[0]) + '\r?\n');
  var c = new RegExp('\n' + escape(delims[1] || delims[0]) + '(?:\r?\n|$)');

  /**
   * Test a string to determine
   * if it contains front-matter
   *
   * @param {String} str
   * @return {Boolean} front-matter?
   */
  var _this = function (str) {
    var out = {
      attributes: null,
      body: str,
    };

    if (!o.test(str)) {
      return out;
    }

    var end = str.search(c);

    if (end === -1) {
      return out;
    }

    // slice out and parse the front-matter
    out.attributes = fn(str.slice(str.indexOf('\n') + 1, end));

    // check if the body actually exists
    var index = (str.indexOf('\n', end + 1) + 1);
    if (!index) {
      out.body = '';
      return out;
    }

    // slice out the body
    out.body = str.slice(str.indexOf('\n', end + 1) + 1);
    return out;
  };

  /**
   * Creates a through stream that
   * emits a single `attributes` event
   * once front-matter is parsed, then
   * simply re-emits body chunks
   *
   * @return {stream.Transform} through stream
   * @api private
   */
  _this.through = function () {
    var self = this; // actually _this
    var data = '';
    var inBody = false;

    // this could still be optimized
    // for where fron-matter doesn't exist
    // if no opening delim is encountered
    // the stream should begin emitting right away
    return new stream.Transform({
      transform: function (chunk, encoding, next) {
        if (!inBody) {
          data += String(chunk);
          try {
            var split = self(data);


            // if front matter was captured emit the
            // attributes event, push whatever remains
            if (split.attributes) {
              inBody = !inBody;
              this.emit('attributes', split.attributes);
              return next(null, split.body);
            }
          } catch (err) {
            next(err);
          }

          // make sure str could actually
          // contain a front-matter block,
          // if not, no need to accumulate chunks
          if (data.length > 6 && !o.test(data)) {
            inBody = !inBody;
            next(null, data);
          }
        } else {
          next(null, chunk);
        }
      },
      flush: function (done) {
        // worst case scenario; str began with an
        // opening delim, but the closing delim
        // does not exist, push all data to buffer
        if (!inBody) {
          this.emit('attributes', null);
          this.push(data);
        }
        done();
      },
    });
  };

  /**
   * Test a string to determine
   * if it contains front-matter
   *
   * @param {String} str
   * @return {Boolean} front-matter?
   */
  _this.test = function (str) {
    return o.test(str) && c.test(str);
  };

  return _this;
}

/**
 * Escape user supplied delimiter
 *
 * @param {String} str
 * @return {String} RegExp escaped string
 */
function escape(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Avoids a conditional where no
 * front-matter transform was provided
 *
 * @param {String} str
 * @return {String} noop on str
 */
function noop(str) {
  return str;
}

// parser is the default export
module.exports = parser;

// expose yaml and json front matter
module.exports.yaml = parser('---', yaml.safeLoad);
module.exports.json = parser(['{{{', '}}}'], function (str) {
  return JSON.parse('{' + str + '}');
});
