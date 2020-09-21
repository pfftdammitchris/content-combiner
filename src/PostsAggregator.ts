import get from 'lodash.get'
import * as T from './types'

class PostsAggregator<DataObject extends {} = any> {
  #targetKeys: string[] | undefined
  fetchers: T.Fetcher<DataObject>[]

  constructor({ fetchers = [] }: { fetchers?: T.Fetcher<DataObject>[] } = {}) {
    this.fetchers = fetchers
  }

  async execute<T = any>(options?: T) {
    const promise = (f: T.Fetcher) => f(options)
    const results = await Promise.all(this.fetchers.map(promise))
    return results
  }

  // TODO: Transducer
  createFetcher(
    fetch: T.Fetcher,
    { keymap = {} }: { keymap?: T.Keymap<DataObject> } = {},
  ) {
    if (typeof fetch !== 'function') {
      throw new Error(
        'The fetch function provided as the first argument is not a function',
      )
    }

    const fetcher = async (
      ...args: any[]
    ): Promise<DataObject[] | undefined> => {
      const results = await fetch(...args)
      if (!results) return

      const reducer = (acc: DataObject[], item: any) => {
        if (item) {
          const result = {} as DataObject
          Object.entries(this.createMappedKeys(keymap)).forEach(
            ([key, mapper]) => {
              // TODO: This logic is supposed to be in createdMapperKeys
              if (typeof mapper === 'string' || Array.isArray(mapper)) {
                result[key] = get(item, mapper)
              } else if (typeof mapper === 'function') {
                result[key] = mapper(item)
              }
            },
          )
          acc.push(result)
        }
        return acc
      }
      return results.reduce(reducer, [])
    }
    this.fetchers.push(fetcher)
    return fetcher
  }

  /**
   * Formats the keymap for the executor
   * @param { Keymap } keymap
   */
  createMappedKeys<Keymap extends T.Keymap<DataObject>>(keymap: Keymap) {
    return (
      this.getTargetKeys().reduce((acc, key) => {
        // Mapped directly by property translation
        if (typeof keymap[key] === 'string') {
          acc[key] = (item: DataObject) => get(item, keymap[key])
        } else if (typeof keymap[key] === 'function') {
          // Function mapper
          acc[key] = keymap[key]
        } else {
          // Default mapper (string)
          acc[key] = (item: DataObject) => get(item, item[key])
        }
        return acc
      }, {}) || {}
    )
  }

  setTargetKeys(targetKeys: string[]) {
    this.#targetKeys = targetKeys
    return this
  }

  getTargetKeys() {
    return this.#targetKeys || []
  }
}

export default PostsAggregator
