<template>
  <v-alert
    :value="show"
    icon="lock"
    class="mt-3"
    style="max-width: 325px"
  >
    Competition is LIVE and data is locked. To make changes <nuxt-link :to="`/${$route.params.id}/compsetup/unlock`">unlock the comp</nuxt-link>
  </v-alert>
</template>

<script>
export default {
  name: 'LockedComp',

  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>
