export function get<T>(obj: T, path: string) {
  if (typeof path !== 'string') return undefined

  let result = obj

  if (isObject(result)) {
    const parts = path.split('.')
    const numParts = parts.length

    for (let index = 0; index < numParts; index++) {
      const key = parts[index]
      result = result[key]

      if (!isObject(result) || index + 1 >= numParts) {
        break
      }
    }

    return result
  }
}

export function isObject(value: unknown): value is object {
  return !!value && typeof value === 'object'
}
