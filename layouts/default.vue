<template>
  <v-app>
    <snackbar />
    <v-navigation-drawer
      :mini-variant="miniVariant"
      v-model="drawer"
      fixed
      app
      dark
    >
      <v-layout
        column
        fill-height>
        <v-list>
          <v-list-tile to="/">
            <v-list-tile-action>
              <img
                src="~/static/smalllogowhite.png"
                width="32"
                alt="Spotter Powerlifting" >
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="amber--text">
                Spotter Powerlifting
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            v-for="(item, i) in topItems"
            :to="item.to"
            :key="i"
            :value="highlightListItem(item.title)"
            router
            exact
          >
            <v-list-tile-action>
              <v-icon
                :color="highlightListIcon(item.title)"
                v-html="item.icon" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title
                v-text="item.title" />
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        
        <v-spacer />
        
        <v-list>
          <v-list-tile
            v-for="(item, i) in bottomItems"
            :to="item.to"
            :key="i"
            router
            exact
          >
            <v-list-tile-action>
              <v-icon v-html="item.icon" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title" />
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider />
        <div :class="collapseButtonAlignment">
          <v-btn
            icon
            @click.stop="miniVariant = !miniVariant">
            <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'" />
          </v-btn>
        </div>
      </v-layout>
    </v-navigation-drawer>

    <v-toolbar
      fixed
      app
      dark
      color="blue"
    >
      <v-toolbar-side-icon 
        class="hidden-lg-and-up"
        @click="drawer = !drawer" />
      <competitions-menu />
      <v-spacer />

      <notifications />

      <login-avatar />

      <v-tabs
        v-if="tabs.length > 0"
        slot="extension"
        v-model="tab"
        color="blue"
      >
        <v-tabs-slider />

        <v-tab
          v-for="tabItem in tabs"
          :key="tabItem.name"
          :to="tabPath(tabItem.to)">
          {{ tabItem.name }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-content>
      <nuxt />
    </v-content>

  </v-app>
</template>

<script>
import '~/node_modules/@mdi/font/css/materialdesignicons.min.css'
import loginAvatar from '~/components/toolbar/loginavatar'
import competitionsMenu from '~/components/toolbar/competitionsMenu'
import notifications from '~/components/toolbar/notifications'
import snackbar from '~/components/notification/snackbar'
import { headingCompSetup, headingLifters } from '~/utils/headings'

export default {
  components: {
    loginAvatar,
    competitionsMenu,
    notifications,
    snackbar
  },

  data() {
    return {
      tab: null,
      drawer: true,
      menu: false,
      topItems: [
        {
          icon: 'home',
          title: 'Comp Overview',
          to: `/${this.$route.params.id}/`
        },
        {
          icon: 'mdi-human-handsup',
          title: 'Run Competition',
          to: `/${this.$route.params.id}/precompchecklist`
        },
        {
          icon: 'build',
          title: 'Comp Setup',
          to: `/${this.$route.params.id}/compsetup/details`
        },
        {
          icon: 'people',
          title: 'Lifters',
          to: `/${this.$route.params.id}/lifters/all`
        },
        {
          icon: 'how_to_reg',
          title: 'Online Registration',
          to: `/${this.$route.params.id}/online`
        },
        {
          icon: 'mdi-trophy-variant-outline',
          title: 'Results',
          to: `/${this.$route.params.id}/results`
        }
      ],
      bottomItems: [
        { icon: 'mdi-settings', title: 'Settings', to: '/settings' },
        { icon: 'mdi-message-alert', title: 'Send Feedback', to: '/feedback' },
        { icon: 'mdi-help-circle', title: 'Help', to: '/help' }
      ],
      miniVariant: false
    }
  },

  head() {
    return {
      title: 'Spotter Powerlifting'
    }
  },

  computed: {
    snackbarMessage: function() {
      return this.$store.state.snackbar.snackbarMessage
    },
    showSnackbar: function() {
      return this.$store.state.snackbar.snackbarMessage !== null
    },
    collapseButtonAlignment: function() {
      return this.miniVariant ? 'text-xs-center mr-2' : 'text-xs-right'
    },
    compIsSelected: function() {
      return this.$store.getters.comp
    },
    tabs: function() {
      const routeName = this.$route.name

      if (routeName !== null && routeName.includes('id-compsetup')) {
        return headingCompSetup
      }

      if (routeName !== null && routeName.includes('id-lifters')) {
        return headingLifters
      }

      return []
    }
  },

  watch: {
    drawer: function(newDrawer, oldDrawer) {
      this.$store.commit('drawer/show', newDrawer)
    },
    miniVariant: function(newMiniVariant, oldMiniVariant) {
      this.$store.commit('drawer/minimize', newMiniVariant)
    }
  },

  created: function() {
    this.$store.watch(
      state => state.drawer.show,
      () => {
        this.drawer = this.$store.state.drawer.show
      }
    )
    this.$store.watch(
      state => state.drawer.minimize,
      () => {
        this.miniVariant = this.$store.state.drawer.minimize
      }
    )
  },

  methods: {
    toggleMenuShow: function() {
      this.$store.commit('drawer/show', !this.$store.state.drawer.show)
    },
    toggleMenuMinimize: function() {
      this.$store.commit('drawer/minimize', !this.$store.state.drawer.minimize)
    },
    tabPath: function(to) {
      return `/${this.$route.params.id}/${to}`
    },
    highlightListItem: function(title) {
      if (this.$route.name === null) return null

      return (
        (title == 'Comp Setup' && this.$route.name.includes('id-compsetup')) ||
        (title == 'Lifters' && this.$route.name.includes('id-lifters'))
      )
    },
    highlightListIcon: function(title) {
      return this.highlightListItem(title) ? 'primary' : null
    }
  }
}
</script>
