<template>
  <v-layout
    justify-center
    wrap
    row>
    <!-- <v-progress-circular
      v-if="loading"
      :size="100"
      :width="8"
      indeterminate
      style="margin-top: 100px"
      color="amber" /> -->

    <v-btn
      style="height: 204px; width: 296px"
      class="mb-3"
      @click="onNewComp">
      <v-layout
        align-center
        justify-center
        column
        fill-height>
        <v-icon
          class="pt-1"
          color="primary"
          x-large>
          add
        </v-icon>
        <div
          color="primary"
          class="title pt-3"
          style="text-transform: none">
          Create competition
        </div>
      </v-layout>
    </v-btn>
    <comp-tile 
      v-for="comp in usersComps"
      :key="comp.id"
      :name="comp.name"
      :date="comp.location"
      :location="comp.ruleset"
      @comp-clicked="onCompClick(comp)" />
  </v-layout>
</template>

<script>
import { firestore } from '@/services/fireinit.js'
import newCompTile from '~/components/allcomps/newcomptile'
import compTile from '~/components/allcomps/comptile'
import { spotterDb } from '~/services/dexieinit'
import uuidv4 from 'uuid/v4'
import moment from 'moment-timezone'

export default {
  layout: 'allcomps',

  components: {
    newCompTile,
    compTile
  },

  data: () => ({
    loading: true,
    usersComps: []
  }),

  async created() {
    this.$store.commit('snackbar/setSnack', '')
    const uid = localStorage.currentUser
    if (!uid) {
      this.$router.push(`/logout`)
    }
  },

  mounted: async function() {
    const uid = localStorage.currentUser
    if (uid) {
      let newComps = this.usersComps
      const comps = await firestore
        .collection('comps')
        .where('compMgrs', 'array-contains', uid)
        .get()

      spotterDb.comps.clear()
      spotterDb.lifters.clear()
      spotterDb.teams.clear()
      spotterDb.federations.clear()
      comps.forEach(doc => {
        let comp = doc.data()
        comp.id = doc.id
        spotterDb.comps.put(comp)
        newComps.push(comp)
      })

      const feds = await firestore
        .collection('federations')
        .orderBy('name')
        .get()

      spotterDb.federations.clear()
      feds.forEach(fed => {
        spotterDb.federations.put(fed.data())
      })
    }

    this.loading = false
  },

  methods: {
    onCompClick: async function(comp) {
      this.$store.commit('recentcomps/addRecentCompetition', comp)

      // Get the comp again but use onSnapshot here to get realtime updates
      const uid = localStorage.currentUser
      const loadedComp = firestore
        .collection('comps')
        .doc(comp.id)
        .onSnapshot(doc => {
          let reloadedComp = doc.data()
          reloadedComp.id = doc.id
          spotterDb.comps.update(comp.id, reloadedComp)
        })

      loadedComp.id = comp.id

      // Store all the LIFTERS in IndexedDb
      const lifters = await firestore
        .collection('comps')
        .doc(comp.id)
        .collection('lifters')
        .get()

      await spotterDb.lifters
        .where('compid')
        .equals(comp.id)
        .delete()

      lifters.forEach(async doc => {
        let lifter = doc.data()
        lifter.id = doc.id
        await spotterDb.lifters.put(lifter)
      })

      // Store all the TEAMS in IndexedDb
      const teams = await firestore
        .collection('comps')
        .doc(comp.id)
        .collection('teams')
        .get()

      await spotterDb.teams
        .where('compid')
        .equals(comp.id)
        .delete()

      teams.forEach(async doc => {
        let team = doc.data()
        team.id = doc.id
        team.compid = comp.id
        team.comp_ref = comp.comp_ref
        await spotterDb.teams.put(team)
      })

      this.$router.push(`/${comp.comp_ref}/`)
    },
    onNewComp: function(compName) {
      this.$router.push(`/newcomp`)
    }
  }
}
</script>
