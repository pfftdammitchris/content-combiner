import { get } from './utils'
import * as T from './types'

class Keymapper<DataObject extends {} = any> {
  keymap: T.Keymap<DataObject> = {}

  /**
   * Uses the key to retrieve the mapped value, which is used on the obj
   * @param { string } key
   */
  get<D extends DataObject>(key: keyof DataObject, obj?: D) {
    if (arguments.length < 2) {
      throw new Error('Missing key or data object')
    }

    let result: any
    const mapper = this.getMapper(key as keyof DataObject)

    if (obj) {
      if (typeof mapper === 'string' || Array.isArray(mapper)) {
        result = get(obj, mapper)
      } else if (typeof mapper === 'function') {
        result = mapper(obj)
      } else {
        result = obj[key]
      }
    }

    return result
  }

  /**
   * Sets the mapper into the keymap by the key
   * @param { string } key
   */
  set(key: keyof DataObject, mapper: T.Mapper<DataObject>) {
    this.keymap[key] = mapper
    return this
  }

  /**
   * Retrieves the mapper set on the keymap by using the key
   * @param { string } key
   */
  getMapper(key: keyof DataObject) {
    return this.keymap[key]
  }
}

export default Keymapper
