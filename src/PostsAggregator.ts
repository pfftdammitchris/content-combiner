import Keymapper from './Keymapper'
import * as T from './types'
import { entries, isArr, isFnc, isObj, isStr } from './utils'

class PostsAggregator<DataObject extends {} = any> {
  #keymapper = new Keymapper()
  #fetchers: T.Fetcher<DataObject>[]
  #dataKeys: string[] = []

  constructor({
    dataKeys = [],
    fetchers = [],
    keymapper,
  }: {
    dataKeys?: string[]
    fetchers?: T.Fetcher<DataObject>[]
    keymapper?: Keymapper
  } = {}) {
    this.#fetchers = fetchers
    this.#keymapper =
      keymapper && keymapper instanceof Keymapper ? keymapper : new Keymapper()
    this.setDataKeys(dataKeys)
  }

  /**
   * Runs each fetcher and parses each list of results using the keymappers that
   * are currently registered
   * @param { object } options - Options passed to each fetch function
   */
  async execute<T = any>(options?: T) {
    let results: DataObject[][] = []
    const numFetchers = this.#fetchers.length
    for (let index = 0; index < numFetchers; index++) {
      const fetch = this.#fetchers[index]
      const result = await fetch(options)
      if (result) {
        if (isArr(result)) {
          results = results.concat(result)
        } else {
          results.push([result])
        }
      }
    }
    return results
  }

  createFetcher(fetch: T.Fetcher, options: { keymappers: T.ConsumerKeymap<DataObject> }) {
    const parseDataObject = (
      dataObject: DataObject,
      keymappers: T.ConsumerKeymap<DataObject>,
    ) =>
      entries(keymappers).reduce((acc, [key, mapper]) => {
        acc[key] = this.#keymapper.parse(mapper as T.Mapper<DataObject>, dataObject)
        return acc
      }, {} as DataObject)

    let err: Error | TypeError | undefined
    // prettier-ignore
    if (!isFnc(fetch)) err = new Error( 'The fetch function provided as the first argument is not a function')
    if (!options.keymappers) err = new TypeError('keymappers is not an object')
    if (err) throw err

    const fetcher = async (...args: any[]): Promise<DataObject | DataObject[]> => {
      const result = await fetch(...args)
      if (!result) return result
      return isArr(result)
        ? result.reduce(
            (acc: DataObject[], item: any) =>
              item ? acc.concat(parseDataObject(item, options.keymappers)) : acc,
            [],
          )
        : parseDataObject(result, options.keymappers)
    }
    fetcher.id = this.#createId()
    this.#fetchers.push(fetcher)
    return fetcher
  }

  /** Formats/parses the keymappers and returns the keymap used on the executor */
  getKeymap(): Record<keyof DataObject, T.FuncMapper<DataObject>> {
    return Array.from(
      new Set(Array.from(this.#keymapper.keymap.keys()).concat(this.getDataKeys())),
    ).reduce((acc, key) => {
      const mapper = this.#keymapper.get(key)
      if (isStr(mapper) || isArr(mapper)) {
        // Mapped directly by property swapping
        acc[key] = (item: DataObject) => this.#keymapper.parse(mapper, item)
      } else if (isFnc(mapper)) {
        // Function mapper
        acc[key] = mapper
      } else {
        // Default mapper (the key itself)
        acc[key] = (item: DataObject) => this.#keymapper.parse(key, item)
      }
      return acc
    }, {} as Record<keyof DataObject, T.FuncMapper<DataObject>>)
  }

  getKeymapper(key: string) {
    return this.#keymapper.get(key)
  }

  setKeymapper(
    key: string | Record<string, T.Mapper<DataObject>>,
    mapper: T.Mapper<DataObject>,
  ) {
    if (isStr(key)) {
      this.#keymapper.set(key, mapper)
    } else if (isObj(key)) {
      entries(key).forEach(([k, v]) => {
        this.#keymapper.set(k, v as T.Mapper<DataObject>)
      })
    }
    return this
  }

  getDataKeys() {
    return this.#dataKeys
  }

  setDataKeys(keys: string[]) {
    this.#dataKeys = keys
    return this
  }

  #createId = () => {
    return `_${Math.random().toString(36).substr(2, 9)}`
  }
}

export default PostsAggregator
