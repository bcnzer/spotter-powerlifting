<template>
  <v-menu
    :nudge-width="100"
    style="opacity: 0.7">
    <v-toolbar-title
      slot="activator"
      class="subheading">
      <span>{{ compName }}</span>
      <v-icon>arrow_drop_down</v-icon>
    </v-toolbar-title>

    <v-list>
      <v-list-tile
        v-for="staticMenuItem in staticMenuItems"
        :key="staticMenuItem.title"
        @click="dosomething"
      >
        <v-list-tile-title
          :to="staticMenuItem.to"
          v-text="staticMenuItem.title" />
      </v-list-tile>
      <v-divider />
      <v-list-tile>
        <v-list-tile-sub-title>Recent</v-list-tile-sub-title>
      </v-list-tile>
      <v-list-tile
        v-for="recentComp in recentcomps"
        :key="recentComp.id"
        @click="dosomething"
      >
        <v-list-tile-title v-text="recentComp.name" />
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import { spotterDb } from '~/services/dexieinit'

export default {
  name: 'CompetitionsMenu',

  data() {
    return {
      compName: null,
      staticMenuItems: [
        { title: 'See all competitions', to: '/' },
        { title: 'Add a competition', to: '/feedback' }
      ]
    }
  },

  computed: {
    recentcomps: function() {
      return this.$store.state.recentcomps.recentCompetitions
    }
  },

  mounted: async function() {
    const result = await spotterDb.comps
      .where('comp_ref')
      .equals(this.$route.params.id)
      .toArray()

    if (result.length != 1) return null
    this.compName = result[0].name
  },

  methods: {
    signOut() {
      this.$store.dispatch('user/signOut').then(() => {
        this.$router.push('/login')
      })
    },

    dosomething() {
      return null
    }
  }
}
</script>
