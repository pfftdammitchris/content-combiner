export function get<T>(obj: T, path: string) {
  let result = obj
  const parts = path.split('.')
  const numParts = parts.length

  for (let index = 0; index < numParts; index++) {
    result = result[index]
    if (!result) return result
    if (typeof result === 'object') continue
  }
}
