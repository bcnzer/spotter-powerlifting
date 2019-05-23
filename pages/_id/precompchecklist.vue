<template>
  <v-layout
    column
    class="mx-3 mt-4">
    <div class="headline mb-1 ml-1">
      Go Live Checklist
    </div>
    <div v-if="!noIssues">
      <div
        class="body-1 ml-2 mt-1">
        All issues must be resolved before you can run lock the competition.
      </div>
      <div class="body-1 ml-2 mt-2 mb-3">
        Locking a competition, which prevents changes to basic lifter information, is required to start the competition
      </div>
    </div>
    <div
      v-if="noIssues"
      class="body-1 ml-2 mt-1 mb-2">
      No issues found. Ready to lock the competition to allow the competition to start
    </div>

    <v-flex
      v-if="noIssues"
      xs12
      sm8
      md6>
      <v-btn
        :disabled="locking"
        :loading="locking"
        color="primary"
        @click="lockCompetition()">
        Lock Competition
      </v-btn>
    </v-flex>
    <v-flex
      v-if="!noIssues"
      xs12
      sm8
      md6>
      <v-expansion-panel style="max-width: 1000px">
        <v-expansion-panel-content v-if="totalPlates < biggestOpener">
          <template v-slot:header>
            <div>Plates
              <v-icon>
                info
              </v-icon>
            </div>
          </template>
          <v-card>
            <div class="ml-4">There are {{ totalPlates }} kg worth of plates entered in Comp Setup yet the biggest opener is {{ biggestOpener }} kg</div>
            <div class="ml-4 mt-2">REMEMBER: these are just openers so you'll likely need even more</div>
            <div class="ml-4 mt-2 mb-4">You need to define more than {{ biggestOpener }} in the <nuxt-link :to="`/${this.$route.params.id}/compsetup/plates`">Plates - Comp Setup</nuxt-link> page</div>
          </v-card>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="missingBodyWeights.length > 0">
          <template v-slot:header>
            <div>Body weights
              <v-avatar
                class="amber ml-2"
                size="32">
                <span class="black--text">{{ missingBodyWeights.length }}</span>
              </v-avatar>
            </div>
          </template>
          <div 
            v-for="lifter in missingBodyWeights"
            :key="lifter.id"
            class="mb-1 ml-4">
            <nuxt-link :to="`/${$route.params.id}/lifters/${lifter.lifter_ref}`">
              {{ lifter.last_name | upperCase }} {{ lifter.first_name }}
            </nuxt-link>
          </div>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="missingSquatOpeners.length > 0">
          <template v-slot:header>
            <div>Openers - Squats
              <v-avatar
                class="amber ml-2"
                size="32">
                <span class="black--text">{{ missingSquatOpeners.length }}</span>
              </v-avatar>
            </div>
          </template>
          <div 
            v-for="lifter in missingSquatOpeners"
            :key="lifter.id"
            class="mb-1 ml-4">
            <nuxt-link :to="`/${$route.params.id}/lifters/${lifter.lifter_ref}`">
              {{ lifter.last_name | upperCase }} {{ lifter.first_name }}
            </nuxt-link>
          </div>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="missingBenchOpeners.length > 0">
          <template v-slot:header>
            <div>Openers - Bench
              <v-avatar
                class="amber ml-2"
                size="32">
                <span class="black--text">{{ missingBenchOpeners.length }}</span>
              </v-avatar>
            </div>
          </template>
          <div 
            v-for="lifter in missingBenchOpeners"
            :key="lifter.id"
            class="mb-1 ml-4">
            <nuxt-link :to="`/${$route.params.id}/lifters/${lifter.lifter_ref}`">
              {{ lifter.last_name | upperCase }} {{ lifter.first_name }}
            </nuxt-link>
          </div>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="missingDeadliftOpeners.length > 0">
          <template v-slot:header>
            <div>Openers - Deadlift
              <v-avatar
                class="amber ml-2"
                size="32">
                <span class="black--text">{{ missingDeadliftOpeners.length }}</span>
              </v-avatar>
            </div>
          </template>
          <div 
            v-for="lifter in missingDeadliftOpeners"
            :key="lifter.id"
            class="mb-1 ml-4">
            <nuxt-link :to="`/${$route.params.id}/lifters/${lifter.lifter_ref}`">
              {{ lifter.last_name | upperCase }} {{ lifter.first_name }}
            </nuxt-link>
          </div>
        </v-expansion-panel-content>

        <v-expansion-panel-content v-if="missingRackHeights.length > 0">
          <template v-slot:header>
            <div>Optional - Rack Heights
              <v-avatar
                class="amber ml-2"
                size="32">
                <span class="black--text">{{ missingRackHeights.length }}</span>
              </v-avatar>
            </div>
          </template>
          <div 
            v-for="lifter in missingRackHeights"
            :key="lifter.id"
            class="mb-1 ml-4">
            <nuxt-link :to="`/${$route.params.id}/lifters/${lifter.lifter_ref}`">
              {{ lifter.last_name | upperCase }} {{ lifter.first_name }}
            </nuxt-link>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  </v-layout>
</template>

<script>
import { firestore } from '~/services/fireinit.js'
import { spotterDb } from '~/services/dexieinit'
import { upperCase } from '~/filters/upperLowerCase'

export default {
  filters: {
    upperCase
  },

  data: () => ({
    search: null,
    missingBodyWeights: [],
    missingSquatOpeners: [],
    missingBenchOpeners: [],
    missingDeadliftOpeners: [],
    missingRackHeights: [],
    totalPlates: 0,
    biggestOpener: 0,
    locking: false
  }),

  computed: {
    lifterToDeleteName: function() {
      if (!this.lifterToDelete) return null
      return `
        ${this.lifterToDelete.first_name} ${this.lifterToDelete.last_name}
      `
    },
    noIssues: function() {
      return (
        this.missingBodyWeights.length === 0 &&
        this.missingSquatOpeners.length === 0 &&
        this.missingBenchOpeners.length === 0 &&
        this.missingDeadliftOpeners.length === 0
      )
    }
  },

  async created() {
    const result = await spotterDb.comps
      .where('comp_ref')
      .equals(this.$route.params.id)
      .toArray()
    if (result.length != 1) return

    const comp = result[0]

    // If it's already locked then redirect immediately to run comp screen
    if (comp.locked == true) {
      this.$router.push(`/${this.$route.params.id}/runcomp`)
    }

    // Figure out what the max date would be for a lifter. Used by Add Lifter
    this.totalPlates =
      comp.plates.barbell_weight +
      comp.plates.plates0d5kg +
      comp.plates.plates0d25kg +
      comp.plates.plates1d25kg +
      comp.plates.plates2d5kg +
      comp.plates.plates5kg +
      comp.plates.plates10kg +
      comp.plates.plates15kg +
      comp.plates.plates20kg +
      comp.plates.plates25kg

    const lifters = await spotterDb.lifters
      .where('comp_ref')
      .equals(this.$route.params.id)
      .toArray()

    // Missing openers
    lifters.forEach(lifter => {
      if (!lifter.lifts.squat1.weight || lifter.lifts.squat1.weight == 0) {
        this.missingSquatOpeners.push(lifter)
      } else if (lifter.lifts.squat1.weight > this.biggestOpener) {
        this.biggestOpener = lifter.lifts.squat1.weight
      }

      if (!lifter.lifts.bench1.weight || lifter.lifts.bench1.weight == 0) {
        this.missingBenchOpeners.push(lifter)
      } else if (lifter.lifts.bench1.weight > this.biggestOpener) {
        this.biggestOpener = lifter.lifts.bench1.weight
      }

      if (
        !lifter.lifts.deadlift1.weight ||
        lifter.lifts.deadlift1.weight == 0
      ) {
        this.missingDeadliftOpeners.push(lifter)
      } else if (lifter.lifts.deadlift1.weight > this.biggestOpener) {
        this.biggestOpener = lifter.lifts.deadlift1.weight
      }

      if (!lifter.squat_height) {
        this.missingRackHeights.push(lifter)
      }
    })
  },

  methods: {
    lockCompetition: async function() {
      this.locking = true
      const result = await spotterDb.comps
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()
      if (result.length != 1) return

      const compId = result[0].id

      const lockData = {
        locked: true
      }
      await firestore
        .collection('comps')
        .doc(compId)
        .update(lockData)

      await spotterDb.comps.update(compId, lockData)

      this.$router.push(`/${this.$route.params.id}/runcomp`)
    },
    saveDob: function() {
      this.$refs.modalDobDialog.save(this.lifterDob)
    }
  }
}
</script>
