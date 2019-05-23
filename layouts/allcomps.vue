<template>
  <v-app>
    <v-content>
      <v-toolbar
        fixed
        app
        dark
        color="transparent"
        style="box-shadow: 0px 0px"
      >
        <v-spacer />

        <notifications icon-colour="black" />
        <login-avatar />
      </v-toolbar>

      <v-layout
        row
        wrap>
        <v-container>
          <v-layout
            row
            wrap>
            <v-flex
              xs12
              class="text-xs-center">
              <img src="~/static/spotterplblack.png">
            </v-flex>
            <v-flex
              xs12
              class="text-xs-center mt-1">
              <v-btn
                color="primary"
                flat
                nuxt
                to="/">Learn more</v-btn>
              <v-btn
                color="primary"
                flat
                nuxt>Documentation</v-btn>
              <v-btn
                color="primary"
                flat
                nuxt>Support</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import loginAvatar from '~/components/toolbar/loginavatar'
import notifications from '~/components/toolbar/notifications'

export default {
  components: {
    loginAvatar,
    notifications
  },

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
