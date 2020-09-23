export const assign = (o: any, opts: any) => Object.assign(o, opts)
export const entries = (o: any) => Object.entries(o)
export const isArr = (val: any): val is Array<any> => Array.isArray(val)
export const isObj = (v: any): v is object => !!v && typeof v === 'object'
export const isStr = (v: any): v is string => !!v && typeof v === 'string'
export const isFnc = (v: any): v is Function => typeof v === 'function'
export const map = (arr: any[], cb: (...args: any[]) => any) => arr.map(cb)
export const spread = (cb: Function) => (args: any[]) => cb(...args)

export const compose = (...fns: Function[]) => (
  keymapAccumulator: Function,
) => (item: any) =>
  fns.reduceRight((acc, reducer) => reducer(acc, item), keymapAccumulator)

export const get = <T>(obj: T, path: string | string[]) => {
  if (typeof path !== 'string' && !isArr(path)) return undefined
  let result = obj
  const parts = isArr(path) ? path.slice() : path.split('.')
  const totalParts = parts.length
  if (isObj(result)) {
    for (let index = 0; index < totalParts; index++) {
      const key = parts[index]
      if (isStr(key)) result = result && result[key]
    }
  }
  return result
}
