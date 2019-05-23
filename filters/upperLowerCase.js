export function upperCase(value) {
  if (typeof value !== 'string') return value
  if (value === null) return null

  return value.toUpperCase()
}

export function lowerCase(value) {
  if (typeof value !== 'string') return value
  if (value === null) return null

  return value.toLowerCase()
}
