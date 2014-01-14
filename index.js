var parser = require('yaml-js')

module.exports = parse;

function parse (string){
  var body = string
    , attributes = {}
    , match = matcher(string, '= yaml =') || matcher(string, '---')

  if (match){
    attributes = parser.load(match[2].replace(/^\s+|\s+$/g, '')) || {}
    body = string.replace(match[0], '')
  }

  return { attributes: attributes, body: body }
}

parse.test = function(string) {
  var body = string
    if (matcher(string, '= yaml =') || matcher(string, '---')) {
      return true
    } else {
      return false
    }
}

function matcher(string, seperator){

  var seperator = seperator || '---'
      , pattern = '^('
        + seperator
        + '$([\\s\\S]*?)'
        + seperator+'$' + (process.platform === 'win32' ? '\\r?' : '') + '(?:\\n)?)'
      , regex = new RegExp(pattern, 'm')
      , match = regex.exec(string)

  if (match && match.length > 0) return match
}
