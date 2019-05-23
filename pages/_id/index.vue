<template>
  <v-container
    class="pa-0">
    <v-layout
      column>
      <v-flex
        xs12>
        <locked-comp :show="isCompLocked" />
        <h1>{{ compName }}</h1>
        <div class="subheading mt-1">{{ compFed }} ruleset - {{ compStartDate }}</div>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      class="mt-2">
      <v-card
        dark
        color="indigo lighten-1"
        class="pa-3 mr-3 mt-2 text-xs-center"
        width="170"
        height="170">
        <div class="subheading">Total Lifters</div>
        <div class="display-2 my-2">{{ totalLifters }}</div>
        <div>{{ liftersCountMale }} Men</div>
        <div>{{ liftersCountFemale }} Women</div>
      </v-card>
      <v-card
        dark
        color="cyan lighten-1"
        class="pa-3 mr-3 mt-2 text-xs-center"
        width="170"
        height="170">
        <div class="subheading">Days Till Comp</div>
        <div class="display-2 my-2">{{ daysTillComp }}</div>
      </v-card>
      <!-- <v-card
        dark
        color="green lighten-1"
        class="pa-3 mr-3 mt-2 text-xs-center"
        width="170"
        height="170">
        <div class="subheading">Registrations Close</div>
        <div v-if="hasRegistrationClosingDate">
          <div class="display-2 my-2">
            {{ daysTillRegistrationCloses }}
          </div>
          <div>days</div>
        </div>
        <div v-else>
          <div class="subheading my-3">
            (No date entered)
          </div>
        </div>
      </v-card> -->
    </v-layout>
  </v-container>

</template>

<script>
import { CurrentComp } from '~/utils/indexedDbHelpers'
import LockedComp from '~/components/lockedcomp/lockedcomp'
import { spotterDb } from '~/services/dexieinit'
import moment from 'moment'

export default {
  components: {
    LockedComp
  },

  data: () => ({
    isCompLocked: false,
    comp: null,
    compName: null,
    compStartDate: null,
    compFed: null,
    liftersCountMale: 0,
    liftersCountFemale: 0,
    daysTillComp: 0,
    daysTillRegistrationCloses: 0,
    hasRegistrationClosingDate: false
  }),

  computed: {
    totalLifters: function() {
      return this.liftersCountMale + this.liftersCountFemale
    }
  },

  async created() {
    const comp = await CurrentComp(this.$route.params.id)
    this.isCompLocked = comp.locked
    this.compName = comp.name
    this.compStartDate = comp.startdate
    this.compFed = comp.federation

    const lifters = await spotterDb.lifters
      .where('comp_ref')
      .equals(this.$route.params.id)
      .toArray()

    this.liftersCountMale = lifters.filter(x => x.gender == 'Male').length
    this.liftersCountFemale = lifters.length - this.liftersCountMale

    this.daysTillComp = moment(this.compStartDate).diff(new Date(), 'days')
    if (comp.onlinereg && comp.onlinereg.closes) {
      this.hasRegistrationClosingDate = true
      this.daysTillRegistrationCloses = moment(comp.onlinereg.closes).diff(
        moment(new Date()),
        'days'
      )
    }
  }
}
</script>
