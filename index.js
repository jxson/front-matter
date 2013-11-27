var parser = require('yaml-js')

module.exports = function(string){
  var body = string
    , attributes = {}
    , match = matcher(string, '= yaml =') || matcher(string, '---')

  if (match){
    attributes = parser.load(match[2].replace(/^\s+|\s+$/g, '')) || {}
    body = string.replace(match[0], '')
  }

  return { attributes: attributes, body: body }
}

function matcher(string, seperator){

  var seperator = seperator || '---'
      , pattern = '^('
        + seperator
        + '$([\\s\\S]*?)'
        + seperator+'$' + (process.platform === 'win32' ? '\\r?' : '') + '\\n)'
      , regex = new RegExp(pattern, 'm')
      , match = regex.exec(string)

  if (match && match.length > 0) return match
}
