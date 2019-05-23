export function displayKgs(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return value

  return `${value.toString()} Kg`
}
