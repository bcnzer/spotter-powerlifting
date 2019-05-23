<template>
  <v-app>
    <v-content>
      <v-container>
        <div class="text-xs-center my-5">
          <img src="~/static/spotterplblack.png">
        </div>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
export default {
  data() {
    return {
      title: 'Spotter Powerlifting'
    }
  },

  head() {
    return {
      title: this.title
    }
  }
}
</script>
