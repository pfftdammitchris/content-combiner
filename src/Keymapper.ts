import { get, isStr, isArr, isFnc } from './utils'
import * as T from './types'

class Keymapper<DataObject extends {} = any> {
  keymap: T.Keymap<DataObject> = new Map()

  /**
   * Uses the key to retrieve the mapped value, which is used on the obj
   * @param { string } key
   */
  parse<D extends DataObject>(mapper: T.Mapper<DataObject>, obj?: D) {
    if (arguments.length < 2) {
      throw new Error('Missing mapper or data object')
    }

    let result: any

    if (obj) {
      if (isStr(mapper) || isArr(mapper)) {
        result = get(obj, mapper)
      } else if (isFnc(mapper)) {
        result = mapper(obj)
      } else {
        result = get(obj, isStr(mapper) ? mapper : String(mapper))
      }
    } else {
      throw new TypeError('Argument "obj" is null or undefined')
    }

    return result
  }

  get(key: string) {
    return this.keymap.get(key)
  }

  /**
   * Sets the mapper into the keymap by the key
   * @param { string } key
   */
  set(key: string, mapper: T.Mapper<DataObject>) {
    this.keymap.set(key, mapper)
    return this
  }
}

export default Keymapper
