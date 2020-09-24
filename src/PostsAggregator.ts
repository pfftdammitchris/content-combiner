import get from 'lodash.get'
import Keymapper from './Keymapper'
import * as T from './types'
import { entries, forEach, isArr, isFnc, isStr, keys, spread } from './utils'

class PostsAggregator<DataObject extends {} = any> {
  #keymapper = new Keymapper()
  #fetchers: T.Fetcher<DataObject>[]

  constructor({
    fetchers = [],
    keymap = {},
  }: { fetchers?: T.Fetcher<DataObject>[]; keymap?: T.Keymap<DataObject> } = {}) {
    this.#fetchers = fetchers
    this.#keymap = keymap
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

  createFetcher(fetch: T.Fetcher) {
    if (!isFnc(fetch)) {
      throw new Error(
        'The fetch function provided as the first argument is not a function',
      )
    }

    const fetcher = async (...args: any[]): Promise<DataObject[]> => {
      const results = await fetch(...args)
      if (!results) return []

      const targetKeys = keys(this.keymap)
      const mappedKeys = this.getMappedKeys()

      return results.reduce((acc: DataObject[], item: any) => {
        if (item) {
          const result = {} as DataObject
          forEach(
            entries(mappedKeys),
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

    this.#fetchers.push(fetcher)

    return fetcher
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
}

export default PostsAggregator
