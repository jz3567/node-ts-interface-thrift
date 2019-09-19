const fs = require('fs')
const path = require('path')

const readFromThrift = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function (err, data) {
      if (err) {
        reject(err)
      }
      try {
        resolve(data.toString())
      } catch (e) {
        reject(e)
      }
    })
  })
}

const writeTs = (writePath, data) => {
  const realPath = path.resolve(__dirname, writePath)
  fs.writeFile(realPath, data, function (err) {
    if (err) {
      console.log('写入失败: ', err)
    }
    console.log('写入成功: ', realPath)
  })
}

module.exports = {
  readFromThrift,
  writeTs
}
