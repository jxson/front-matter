var yaml = require('yamlparser')
;

module.exports = function(data){
  // http://stackoverflow.com/q/1068308
  var data = data || ''
    , regex = /^(\s*---([\s\S]+)---\s*)/gi
    , match = regex.exec(data)
    , attributes
    , body

  if (match && match.length > 0){
    var yamlString = match[2].replace(/^\s+|\s+$/g, '')

    attributes = yaml.eval(yamlString)
    body = data.replace(match[0], '')
  } else {
    attributes = {};
    body = data;
  }

  return {
    attributes: attributes,
    body: body
  };
}
