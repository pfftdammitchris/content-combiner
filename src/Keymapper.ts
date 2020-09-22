import { get } from './utils'
import * as T from './types'

class Keymapper<DataObject extends {} = any> {
  keymap: T.Keymap<DataObject> = {}

  setMapper(key: keyof DataObject, mapper: T.Mapper<DataObject>) {
    this.keymap[key] = mapper
    return this
  }

  getMapper(key: keyof DataObject) {
    return this.keymap[key]
  }

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
      }
    }

    return result
  }
}

export default Keymapper
