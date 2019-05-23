<template>
  <div
    v-if="user"
    class="text-xs-center">
    <v-menu
      :close-on-content-click="false"
      offset-x>
      <v-btn
        slot="activator"
        icon>
        <v-avatar
          v-if="user.photoURL"
          size="32">
          <img
            :src="user.photoURL"
            alt="Spotter">
        </v-avatar>
        <v-icon
          v-if="!user.photoURL"
          style="opacity: 0.7"
          dark>
          account_circle
        </v-icon>
      </v-btn>
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar size="42">
              <img
                v-if="user.photoURL"
                :src="user.photoURL"
                alt="Spotter">
              <img
                v-if="!user.photoURL"
                src="~/static/spottersemitrans.png"
                alt="Spotter">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title
                v-if="displayName"
                class="subheading">
                {{ displayName }}
              </v-list-tile-title>
              <v-list-tile-sub-title v-if="user.email">{{ user.email }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-btn
                primary
                class="mt-3 mb-4"
                color="info"
                to="/profile">
                Profile
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider />

          <v-list-tile>
            <v-spacer />
            <v-list-tile-action>
              <v-btn
                class="mt-2"
                @click.native="signOut">
                Sign out
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'LoginAvatar',

  computed: {
    user() {
      return this.$store.state.user.currentUser
    },
    displayName() {
      if (this.$store.state.user && this.$store.state.user.currentUser) {
        return this.$store.state.user.currentUser.displayName
      }

      return null
    }
  },

  methods: {
    signOut() {
      this.$store.dispatch('user/signOut').then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>
