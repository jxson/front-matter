
const minimist = require('minimist')
    , argv = minimist(process.argv.slice(2))
    , files = argv._
    , path = require('path')
    , fs = require('fs')
    , fm = require('../')
    , parallel = require('run-parallel')

parallel(files.map(map), finish)

function map(name) {
  return read.bind(null, name)
}

function read(name, callback) {
  var file = path.resolve(__dirname, '..', name)
    , basename = path.basename(file, '.md')

  fs.readFile(file, 'utf8', function onread(err, data) {
    callback(err, { example: basename
    , data: data
    })
  })
}

function finish(err, res) {
  if (err) throw err

  var cwd = process.cwd()
    , outfile = path.resolve(cwd, argv.outfile)
    , json = {}

  for (var i = 0; i < res.length; i++) {
    json[res[i].example] = res[i].data
  }

  fs.writeFile(outfile, JSON.stringify(json, null, 2), 'utf8')
}
