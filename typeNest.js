const typeMap = {
  bool: 'boolean',
  i16: 'number',
  i32: 'number',
  i64: 'Buffer',
  double: 'number',
  string: 'string'

  // 俩没找到
  // binary: '二进制',
  // byte: '8位有符号整数',

  // container
  // list: '[]',
  // map: '{}',
  // set: '[]'
}

const mapType2Str = type => {
  return typeMap[type] || type
}

const reSwapTypeParams = (needComma = false) => (_, p1, p2) => {
  if (!p1 && !p2) return ''
  if (/\s*=\s*\d*/.test(p2)) {
    p2 = p2.replace(/\s*=\s*\d*/, '')
  }
  return `${p2}: ${mapType2Str(p1)}${needComma ? ';' : ''}`
}

const reSwapContainerParams = (needComma = false) => (_, p1, p2) => {
  if (!p1 && !p2) return ''
  if (/\s*=\s*\d*/.test(p2)) {
    p2 = p2.replace(/\s*=\s*\d*/, '')
  }
  return `${p2}: ${trans(mapType2Str(p1))}${needComma ? ';' : ''}`
}

const trans = str => {
  if (/<.*?>/.test(str)) {
    const inner =
      str.match(/(?<container>.*?)<(?<content>[\w,\s{}[\]:.]*)>\s*/).groups || {}
    if (inner.content) {
      const container = inner.container
      if (container === 'list' || container === 'set') {
        return trans(mapType2Str(inner.content)) + '[]'
      }
      if (container.includes('<')) {
        return container
          .split('<')
          .reverse()
          .reduce((acc, cur) => trans(`${cur}<${acc || inner.content}>`), '')
      }
      const [k, v] = inner.content
        .split(',')
        .map(item => item.split(' ').join(''))

      // 处理嵌套map 默认string为key 不太好
      if (!v) {
        return `{[propName: string]: ${mapType2Str(k)}}`
      }
      return `{[propName: ${k}]: ${trans(mapType2Str(v))}}`
    }
  } else {
    return str
  }
}

const convert = str => {
  let a = str
  // 去除参数位置标识
  a = a.replace(/\s*\d:\s*/g, '').replace(/,/g, ',')
  // 去除optional && required
  a = a.replace(/(?:optional\s*|required\s*)/g, '')

  // type function => function: type
  if (/(?:list\s*<|set\s*<|map\s*).*?\(/.test(a)) {
    a = a.replace(/\s*(.*?>)\s+(.*?);/, reSwapContainerParams(true))
  } else {
    a = a.replace(/\s*([\w.]*)\s*(.*?);/, reSwapTypeParams(true))
  }

  // deal with params
  a = a.replace(
    /\(.*?\)/,
    `(${a
      .match(/\((?<params>.*?)\)/)
      .groups.params.split(',')
      .map(item => {
        return /(?:list\s*<|set\s*<|map\s*)/.test(item)
          ? item.replace(/\s*(.*?>)\s+(.*)/, reSwapContainerParams())
          : item.replace(/\s*(\w*)\s*(\w*)\s*/, reSwapTypeParams())
      })
      .join(', ')})`
  )
  return a
}

module.exports = {
  mapType2Str,
  reSwapTypeParams,
  reSwapContainerParams,
  convert
}
