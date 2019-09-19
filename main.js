const utils = require('./utils')
const { buildService } = require('./build')
const { buildStruct } = require('./buildStruct')
const fs = require('fs')

/*
 * params:
 * readDir: 包含thrift文件的路径 etc. ./thrift
 * wirteDir: 想要写入ts的路径 etc. ../test-nest/src/buildTs
*/
const main = (readDir, wiriteDir) => {
  fs.readdir(readDir, {}, (err, files) => {
    if (err) console.log('err', err)
    files.map(file => file.split('.')[0]).forEach(
      thrift => {
        utils.readFromThrift(`${readDir}/${thrift}.thrift`)
          .then(txt => {
            const struct = buildStruct(txt)
            const service = buildService(txt)

            utils.writeTs(`${wiriteDir}/${thrift}.ts`,
              '' + service +
              '\n' +
              struct)
          })
          .catch(err => {
            console.log('err occured', err)
          })
      }
    )
  })
}

main('./thrift', './thrift')
