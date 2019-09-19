const { reSwapContainerParams, reSwapTypeParams } = require('./typeNest')

const buildStruct = txt => {
  // 清除 //
  let result = txt.replace(/\/\/.*/g, '')

  // 清除 /*
  result = result.replace(/\/\*.*?\*\//gsm, '')

  // 匹配struct分组
  result = result.match(/struct .*?{.*?}/gsm)
  if (!result) {
    return []
  }

  // 遇到{} 另起一行
  result = result.map(item => item.replace('{', '{\n').replace('}', '\n}'))

  // 清除空格
  result = result.map(item =>
    item.split('\n').map(i => i.replace(/\s*(.*?)\s*/, '$1'))
      .filter(item => !!item)
  )

  const ts = []
  for (const service of result) {
    const serviceTs = []
    for (const index in service) {
      const per = service[index]
      let tmp = per
      if (index === '0') {
        tmp = tmp.replace('struct', 'export interface')
      } else if (index != service.length - 1) {
        // 统一加; 作为终止标志
        tmp = tmp.replace(/;\s*$/, ';')
        if (!tmp.endsWith(';')) {
          tmp = tmp + ';'
        }
        // 去除参数位置标识
        tmp = tmp.replace(/\s*\d*:\s*/g, '').replace(/,/g, ',')
        // 去除optional && required
        tmp = tmp.replace(/(?:optional\s*|required\s*)/g, '')

        // type function => function: type
        if (/(?:list\s*<|set\s*<|map\s*).*?/.test(tmp)) {
          tmp = tmp.replace(/\s*(.*?>)\s+(.*?);/, reSwapContainerParams(true))
        } else {
          tmp = tmp.replace(/\s*([\w.]*)\s*(.*?);/, reSwapTypeParams(true))
        }
        tmp = '  ' + tmp
      }
      tmp = tmp + '\n'
      serviceTs.push(tmp)
    }
    ts.push(serviceTs)
  }

  return ts.map(
    item => item.join('')
  ).join('')
}

module.exports = {
  buildStruct
}
