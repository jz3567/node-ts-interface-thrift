const { convert } = require('./typeNest')

const buildService = txt => {
  // 清除 //
  let result = txt.replace(/\/\/.*/g, '')

  // 清除 /*
  result = result.replace(/\/\*.*?\*\//gsm, '')

  // 匹配include
  let head = result.match(/include "(?<bean>.*?)\.thrift"/) || ''
  if (head) {
    head = `import * as ${head.groups.bean} from './${head.groups.bean}';`
  }

  // 匹配service分组
  result = result.match(/service .*?{.*?}/gsm)

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
        tmp = tmp.replace('service', 'export interface')
      } else if (index != service.length - 1) {
        // 统一加; 作为终止标志
        tmp = tmp.replace(/;\s*$/, ';')
        if (!tmp.endsWith(';')) {
          tmp = tmp + ';'
        }
        tmp = convert(tmp)
        tmp = '  ' + tmp
      }
      tmp = tmp + '\n'
      serviceTs.push(tmp)
    }
    ts.push(serviceTs)
  }

  return head + '\n\n' + ts.map(
    item => item.join('')
  ).join('')
}

module.exports = {
  buildService
}
