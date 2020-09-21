import { get } from './utils'
import { Keymap, Keymapper } from './types'

class Translator<DataObject = any> {
  keymap: Keymap<DataObject> = {}

  setKeymapper(key: string, mapper: Keymapper<DataObject>) {
    this.keymap[key] = mapper
    return this
  }

  getKeymapper(key: string) {
    return this.keymap[key]
  }

  get(key: string, obj: DataObject): any
  get(key: string[], obj: DataObject): any
  get(obj: DataObject): any
  get(key: string | DataObject, dataObject?: DataObject) {
    let result
    let mapper

    if (key) {
      mapper = this.keymap[key as keyof DataObject]

      if (typeof mapper === 'string' || Array.isArray(mapper)) {
        if (arguments.length <= 1) {
          throw new Error(
            `The mapper for key "${key}" is a string or array. You must provide a dataObject as a second argument`,
          )
        }
        result = get(dataObject, mapper)
      } else if (typeof key === 'object') {
        const objKeys = Object.keys(key)
        result = objKeys.reduce((acc, k) => {
          acc[k] = key[this.keymap[k] || k]
          return acc
        }, {})
      }
    }

    return result
  }
}

export default Translator
