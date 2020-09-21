export function get<T>(obj: T, path: string | string[]) {
  if (typeof path !== 'string' && !Array.isArray(path)) {
    return undefined
  }

  let result = obj
  const parts = Array.isArray(path) ? path.slice() : path.split('.')
  const totalParts = parts.length

  if (isObject(result)) {
    for (let index = 0; index < totalParts; index++) {
      const key = parts[index]
      if (typeof key === 'string') {
        result = result && result[key]
      }
    }
  }

  return result
}

export function isObject(value: unknown): value is object {
  return !!value && typeof value === 'object'
}
