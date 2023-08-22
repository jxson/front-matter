const parser = require('js-yaml')
const optionalByteOrderMark = '\\ufeff?'
const platform = typeof process !== 'undefined' ? process.platform : ''
const pattern = '^(' +
  optionalByteOrderMark +
  '(= yaml =|---)' +
  '$([\\s\\S]*?)' +
  '^(?:\\2|\\.\\.\\.)\\s*' +
  '$' +
  (platform === 'win32' ? '\\r?' : '') +
  '(?:\\n)?)'
// NOTE: If this pattern uses the 'g' flag the `regex` variable definition will
// need to be moved down into the functions that use it.
const regex = new RegExp(pattern, 'm')

module.exports = extractor
module.exports.test = test

function extractor (string, options) {
  string = string || ''
  const defaultOptions = { allowUnsafe: false }
  options = options instanceof Object ? { ...defaultOptions, ...options } : defaultOptions
  options.allowUnsafe = Boolean(options.allowUnsafe)
  const lines = string.split(/(\r?\n)/)
  if (lines[0] && /= yaml =|---/.test(lines[0])) {
    return parse(string, options.allowUnsafe)
  } else {
    return {
      attributes: {},
      body: string,
      bodyBegin: 1
    }
  }
}

function computeLocation (match, body) {
  let line = 1
  let pos = body.indexOf('\n')
  const offset = match.index + match[0].length

  while (pos !== -1) {
    if (pos >= offset) {
      return line
    }
    line++
    pos = body.indexOf('\n', pos + 1)
  }

  return line
}

function parse (string, allowUnsafe) {
  const match = regex.exec(string)
  if (!match) {
    return {
      attributes: {},
      body: string,
      bodyBegin: 1
    }
  }

  const loader = allowUnsafe ? parser.load : parser.safeLoad
  const yaml = match[match.length - 1].replace(/^\s+|\s+$/g, '')
  const attributes = loader(yaml) || {}
  const body = string.replace(match[0], '')
  const line = computeLocation(match, string)

  return {
    attributes,
    body,
    bodyBegin: line,
    frontmatter: yaml
  }
}

function test (string) {
  string = string || ''

  return regex.test(string)
}
