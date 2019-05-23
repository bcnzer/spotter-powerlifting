<template>
  <v-btn
    icon>
    <v-icon
      :color="iconColour"
      style="opacity: 0.6">
      notifications
    </v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'Notifications',
  props: {
    iconColour: {
      type: [String],
      default: 'white'
    }
  }
}
</script>
