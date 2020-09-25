import get from 'lodash.get'
import Keymapper from './Keymapper'
import * as T from './types'
import { assign, entries, forEach, isArr, isFnc, isStr, keys, map, spread } from './utils'

class PostsAggregator<DataObject extends {} = any> {
  #keymapper = new Keymapper()
  #keymap: T.Keymap<DataObject>
  #fetchers: T.Fetcher<DataObject>[]

  constructor({
    fetchers = [],
    keymap = {},
    keymapper,
  }: {
    fetchers?: T.Fetcher<DataObject>[]
    keymap?: T.Keymap<DataObject>
    keymapper?: Keymapper
  } = {}) {
    this.#fetchers = fetchers
    this.#keymap = keymap
    this.#keymapper =
      keymapper && keymapper instanceof Keymapper ? keymapper : new Keymapper()
  }

  get keymap() {
    return this.#keymapper.keymap
  }

  async execute<T = any>(options?: T) {
    const results: any[][] = []
    const numFetchers = this.#fetchers.length

    for (let index = 0; index < numFetchers; index++) {
      const fetch = this.#fetchers[index]
      const result = await fetch(options)
      results.push(
        result.map((r) => {
          const res = {}
          forEach(entries(r), ([k, v]) => {
            res[k] = this.#keymapper.get(k, v)
          })
          return res
        }),
      )
    }

    return results
  }

  createFetcher(fetch: T.Fetcher, options: { keymappers?: T.Keymap<DataObject> } = {}) {
    if (!isFnc(fetch)) {
      throw new Error(
        'The fetch function provided as the first argument is not a function',
      )
    }

    const { keymappers } = options

    const fetcher = async (...args: any[]): Promise<DataObject[]> => {
      const results = await fetch(...args)
      if (!results) return []

      return results.reduce((acc: DataObject[], item: any) => {
        if (item) {
          const result = {} as DataObject
          forEach(
            entries(keymappers),
            spread((key: string, mapper: T.Mapper<DataObject>) => {
              if (targetKeys.includes(key)) {
                if (isStr(mapper) || isArr(mapper)) {
                  result[key] = get(item, mapper)
                } else if (isFnc(mapper)) {
                  result[key] = mapper(item)
                }
              } else {
                result[key] = item[key]
              }
            }),
          )
          acc.push(result)
        }
        return acc
      }, [])
    }

    fetcher.id = this.#createId()

    this.#fetchers.push(fetcher)

    return fetcher
  }

  #functifyKeymappers = (keymappers: T.Keymap<DataObject>) => {
    const m = (fn) => (step) => (acc, item) => step(acc, fn(item))
    const step = (acc, [key, mapper]) => (item) => assign(acc, { [key]: mapper(item) })
    const x = (fn) => (acc, o) => assign(acc, fn(o))
    const keyedMapper = entries(keymappers).reduce((acc, [key, mapper]) => {
      if (isStr(mapper) || isArr(mapper)) {
        // Mapped directly by property swapping
        acc[key] = (item: DataObject) => get(item, mapper)
      } else if (isFnc(mapper)) {
        // Function mapper
        acc[key] = this.keymap[key]
      } else {
        // Default mapper (string)
        acc[key] = (item: DataObject) => get(item, item[key])
      }
      return acc
    }, {})
    const compose = (mappers: [string, T.FuncMapper<DataObject>][]) => (accumulate) =>
      entries(mappers).reduce(
        (acc, [key, mapper]) => accumulate(assign(acc, { [key]: mapper })),
        (item) => accumulate(item),
      )

    const xform = compose()
  }

  /**
   * Formats the keymap for the executor
   * @param { Keymap } keymap
   */
  getMappedKeys() {
    return (
      keys(this.keymap).reduce((acc, key) => {
        if (isStr(this.keymap[key])) {
          // Mapped directly by property swapping
          acc[key] = (item: DataObject) => get(item, this.keymap[key])
        } else if (isFnc(this.keymap[key])) {
          // Function mapper
          acc[key] = this.keymap[key]
        } else {
          // Default mapper (string)
          acc[key] = (item: DataObject) => get(item, item[key])
        }
        return acc
      }, {} as T.FinalizedKeymap<any>) || ({} as T.FinalizedKeymap<any>)
    )
  }

  #createId = () => {
    return `_${Math.random().toString(36).substr(2, 9)}`
  }
}

export default PostsAggregator
