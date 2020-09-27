export const assign = (o: any, opts: any) => Object.assign(o, opts)
export const entries = (o: any) => Object.entries(o)
export const forEach = (arr: any[], cb: (...args: any[]) => any) => arr.forEach(cb)
export const isArr = (val: any): val is Array<any> => Array.isArray(val)
export const isObj = (v: any): v is object => !!v && typeof v === 'object'
export const isStr = (v: any): v is string => !!v && typeof v === 'string'
export const isFnc = (v: any): v is Function => typeof v === 'function'
export const keys = (obj: any) => (isObj(obj) ? Object.keys(obj) : [])
export const map = (arr: any[], cb: (...args: any[]) => any) => arr.map(cb)
export const spread = (cb: Function) => (args: any[], ...rest: any[]) => cb(args, ...rest)

export const get = <T>(obj: T, path: string | string[]) => {
  if (typeof path !== 'string' && !isArr(path)) return undefined
  let result = obj
  let parts = isArr(path) ? path.slice() : path.split('.')
  let totalParts = parts.length
  if (isObj(result)) {
    for (let index = 0; index < totalParts; index++) {
      const key = parts[index]
      if (isStr(key)) result = result && result[key]
    }
  }
  return result
}

export const isArrMember = (str: string) => /\[[0-9]\]/i.test(str)
export const isArrMemberRegex = /\[[0-9]\]/i

export const has = (obj: any, path: string) => {
  if (!isStr(path) && !isArr(path)) return false
  let result = obj
  let parts = (isArr(path) ? path.slice() : path.split('.')) as any[]
  let key

  if (isObj(obj)) {
    while (parts.length) {
      key = parts.shift()
      if (isStr(key)) {
        const match = key.match(isArrMemberRegex)
        if (match) {
          const bracket = match[0]
          const bracketStartIndex = match.index
          const matchInput = match.input || ''

          key = matchInput.substring(0, matchInput.indexOf(bracket))

          if (bracketStartIndex !== undefined) {
            if (bracketStartIndex > 0) {
              result = result[key]
              parts.unshift(bracket)
              continue
            } else {
              const index = Number(match[0].replace(/(\[|\])/gi, ''))
              if (isArr(result)) {
                if (index + 1 > result.length) return false
              }
              // Start off with entering the array
              result = result[0]
            }
          }
        } else {
          result = result && result[key]
          if (!result) return false
        }
      } else return false
    }
    if (!result) return false
  } else return false
  return true
}
