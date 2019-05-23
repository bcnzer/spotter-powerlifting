import { spotterDb } from '~/services/dexieinit'

export async function CurrentComp(comp_ref) {
  const result = await spotterDb.comps
    .where('comp_ref')
    .equals(comp_ref)
    .toArray()

  if (result.length != 1) {
    const msg = `Error accessing the current competition from indexedDb. The ID: ${
      this.$route.params.id
    }`

    console.error(msg)
    this.$sentry.captureException(new Error(msg))
    return null
  }

  return result[0]
}
