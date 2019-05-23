<template>
  <v-container fluid>
    <v-layout v-if="!loading">
      <v-flex
        v-show="sortedLifters !== null"
        xs-9>
        <table class="v-datatable v-table elevation-1">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Bodyweight</th>
              <th
                v-if="displaySquats"
                :class="highlightHeader(liftNames.Squat1)">
                Squat 1
              </th>
              <th
                v-if="displaySquats"
                :class="highlightHeader(liftNames.Squat2)">
                Squat 2
              </th>
              <th
                v-if="displaySquats"
                :class="highlightHeader(liftNames.Squat3)">
                Squat 3
              </th>
              <th
                v-if="displaySquats || displayBench">
                Best Squat
              </th>
              <th v-if="displaySquats">Opening Bench</th>

              <th
                v-if="displayBench"
                :class="highlightHeader(liftNames.Bench1)">
                Bench 1
              </th>
              <th
                v-if="displayBench"
                :class="highlightHeader(liftNames.Bench2)">
                Bench 2
              </th>
              <th
                v-if="displayBench"
                :class="highlightHeader(liftNames.Bench3)">
                Bench 3
              </th>
              <th v-if="displayBench">Best Bench</th>
              <th v-if="displayBench || displayDeadlift">Sub Total</th>
              <th v-if="displaySquats || displayBench">Opening Deadlift</th>

              <th
                v-if="displayDeadlift"
                :class="highlightHeader(liftNames.Deadlift1)"
              >Deadlift 1</th>
              <th
                v-if="displayDeadlift"
                :class="highlightHeader(liftNames.Deadlift2)"
              >Deadlift 2</th>
              <th
                v-if="displayDeadlift"
                :class="highlightHeader(liftNames.Deadlift3)"
              >Deadlift 3</th>
              <th v-if="displayDeadlift">Best Deadlift</th>
              <th v-if="displayDeadlift">Total</th>
              <th v-if="displayDeadlift">Wilks</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="lifter in sortedLifters" 
              :key="lifter.id">
              <run-comp-cell :class="highlightCell(lifter)">{{ lifter.first_name }}</run-comp-cell>

              <run-comp-cell :class="highlightCell(lifter)">{{ lifter.last_name }}</run-comp-cell>

              <run-comp-cell :class="`${highlightCell(lifter)} text-xs-center`">{{ lifter.body_weight }}</run-comp-cell>

              <!-- If Squat 1 to 3 is selected display these columns -->
              <run-comp-lift-cell
                v-if="displaySquats"
                :lift="lifter.lifts.squat1"
                :lift-weight="lifter.lifts.squat1.weight"
                :show-button-if-empty="true"
                :lifter="lifter"
                :previous-attempt-weight="previousAttemptWeight"
                :current-lift-type="liftNames.Squat1"
                :is-current-weight="isCurrentLifter(lifter) && currentLift === liftNames.Squat1"
                :highlighted="(isCurrentOrPreviousLifter(lifter) && currentLift === liftNames.Squat1) || (isCurrentLifter(lifter) && (currentLift === liftNames.Squat2 || currentLift === liftNames.Squat3))"
              />

              <run-comp-lift-cell
                v-if="displaySquats"
                :lift="lifter.lifts.squat2"
                :lift-weight="lifter.lifts.squat2.weight"
                :show-button-if-empty="true"
                :lifter="lifter"
                :previous-attempt-weight="previousAttemptWeight"
                :current-lift-type="liftNames.Squat2"
                :is-current-weight="isCurrentLifter(lifter) && currentLift === liftNames.Squat2"
                :highlighted="(isCurrentOrPreviousLifter(lifter) && currentLift === liftNames.Squat2) || (isCurrentLifter(lifter) && currentLift === liftNames.Squat3)"
              />

              <run-comp-lift-cell
                v-if="displaySquats"
                :lift="lifter.lifts.squat3"
                :lift-weight="lifter.lifts.squat3.weight"
                :show-button-if-empty="true"
                :lifter="lifter"
                :previous-attempt-weight="previousAttemptWeight"
                :current-lift-type="liftNames.Squat3"
                :is-current-weight="isCurrentLifter(lifter) && currentLift === liftNames.Squat3"
                :highlighted="isCurrentOrPreviousLifter(lifter) && currentLift === liftNames.Squat3"
              />

              <run-comp-cell
                v-if="displaySquats || displayBench"
                :center-content="true"
                :highlighted="isCurrentLifter(lifter) && isLiftBench(currentLift)"
              >
                <!-- best squat -->
                {{ lifterTopSquat(lifter) | statsDash }}
              </run-comp-cell>

              <run-comp-cell
                v-if="displaySquats"
                :center-content="true">
                <!-- bench we show as a preview during squats -->
                {{ lifter.lifts.bench1.weight | statsDash }}
                <span v-if="lifter.bench0RecordAttempt">R</span>
              </run-comp-cell>

              <!-- bench 1-3 -->
              <run-comp-lift-cell
                v-if="displayBench"
                :lift="lifter.lifts.bench1"
                :lift-weight="lifter.lifts.bench1.weight"
                :show-button-if-empty="true"
                :lifter="lifter"
                :previous-attempt-weight="previousAttemptWeight"
                :current-lift-type="liftNames.Bench1"
                :is-current-weight="isCurrentLifter(lifter) && currentLift === liftNames.Bench1"
                :highlighted="isLiftBench(currentLift) && ((isCurrentOrPreviousLifter(lifter) && currentLift === liftNames.Bench1) || (isCurrentLifter(lifter) && (currentLift === liftNames.Bench2 || currentLift === liftNames.Bench3)))"
              />

              <run-comp-lift-cell
                v-if="displayBench"
                :lift="lifter.lifts.bench2"
                :lift-weight="lifter.lifts.bench2.weight"
                :show-button-if-empty="true"
                :lifter="lifter"
                :previous-attempt-weight="previousAttemptWeight"
                :current-lift-type="liftNames.Bench2"
                :is-current-weight="isCurrentLifter(lifter) && currentLift === liftNames.Bench2"
                :highlighted="isLiftBench(currentLift) && ((isCurrentOrPreviousLifter(lifter) && currentLift === liftNames.Bench2) || (isCurrentLifter(lifter) && (currentLift === liftNames.Bench3)))"
              />

              <run-comp-lift-cell
                v-if="displayBench"
                :lift="lifter.lifts.bench3"
                :lift-weight="lifter.lifts.bench3.weight"
                :show-button-if-empty="true"
                :lifter="lifter"
                :previous-attempt-weight="previousAttemptWeight"
                :current-lift-type="liftNames.Bench3"
                :is-current-weight="isCurrentLifter(lifter) && currentLift === liftNames.Bench3"
                :highlighted="isLiftBench(currentLift) && (isCurrentOrPreviousLifter(lifter) && currentLift === liftNames.Bench3)"
              />

              <run-comp-cell
                v-if="displayBench"
                :center-content="true">
                <!-- Best bench -->
                {{ lifterTopBench(lifter) | statsDash }}
              </run-comp-cell>

              <run-comp-cell
                v-if="displayBench || displayDeadlift"
                :center-content="true"
                :highlighted="isCurrentLifter(lifter) && isLiftDeadlift(currentLift)"
              >
                <!-- sub total -->
                {{ lifterSubTotal(lifter) | statsDash }}
              </run-comp-cell>

              <run-comp-cell
                v-if="displaySquats || displayBench"
                :center-content="true">
                <!-- opening deadlift -->
                {{ lifter.lifts.deadlift1.weight }}
                <span v-if="lifter.lifts.deadlift1.record_attempt">R</span>
              </run-comp-cell>

              <!-- deadlift 1-3 -->
              <run-comp-lift-cell
                v-if="displayDeadlift"
                :lift="lifter.lifts.deadlift1"
                :lift-weight="lifter.lifts.deadlift1.weight"
                :show-button-if-empty="true"
                :lifter="lifter"
                :previous-attempt-weight="previousAttemptWeight"
                :current-lift-type="liftNames.Deadlift1"
                :is-current-weight="isCurrentLifter(lifter) && currentLift === liftNames.Deadlift1"
                :highlighted="isLiftDeadlift(currentLift) && ((isCurrentOrPreviousLifter(lifter) && currentLift === liftNames.Deadlift1) || (isCurrentLifter(lifter) && (currentLift === liftNames.Deadlift2 || currentLift === liftNames.Deadlift3)))"
              />

              <run-comp-lift-cell
                v-if="displayDeadlift"
                :lift="lifter.lifts.deadlift2"
                :lift-weight="lifter.lifts.deadlift2.weight"
                :show-button-if-empty="true"
                :lifter="lifter"
                :previous-attempt-weight="previousAttemptWeight"
                :current-lift-type="liftNames.Deadlift2"
                :is-current-weight="isCurrentLifter(lifter) && currentLift === liftNames.Deadlift2"
                :highlighted="isLiftDeadlift(currentLift) && ((isCurrentOrPreviousLifter(lifter) && currentLift === liftNames.Deadlift2) || (isCurrentLifter(lifter) && (currentLift === liftNames.Deadlift3)))"
              />

              <run-comp-lift-cell
                v-if="displayDeadlift"
                :lift="lifter.lifts.deadlift3"
                :lift-weight="lifter.lifts.deadlift3.weight"
                :show-button-if-empty="true"
                :lifter="lifter"
                :previous-attempt-weight="previousAttemptWeight"
                :current-lift-type="liftNames.Deadlift3"
                :is-current-weight="isCurrentLifter(lifter) && currentLift === liftNames.Deadlift3"
                :highlighted="isLiftDeadlift(currentLift) && (isCurrentOrPreviousLifter(lifter) && currentLift === liftNames.Deadlift3)"
              />

              <run-comp-cell
                v-if="displayDeadlift"
                :center-content="true">
                <!-- top deadlift -->
                {{ lifterTopDeadlift(lifter) | statsDash }}
              </run-comp-cell>

              <run-comp-cell
                v-if="displayDeadlift"
                :center-content="true">
                <!-- total -->
                {{ lifterTotal(lifter) | statsDash }}
              </run-comp-cell>

              <run-comp-cell
                v-if="displayDeadlift"
                :center-content="true">
                <!-- wilks -->
                {{ lifterWilks(lifter) | statsDash }}
              </run-comp-cell>
            </tr>
          </tbody>
        </table>
      </v-flex>

      <v-flex
        v-show="sortedLifters !== null"
        xs-3
        class="ml-3">
        <div class="display-1 mb-0">{{ currentLifter.last_name | upperCase }}</div>
        <div class="display-1 mb-2">{{ currentLifter.first_name }}</div>
        <div
          v-if="!currentWeight || currentWeight == 0"
          class="display-1 mb-2">
          <b>(Not entered)</b>
        </div>
        <div
          v-else
          class="display-1 mb-2">
          <b>{{ currentWeight | displayKgs }}</b>
        </div>
        <div class="display-1">{{ currentLift }}</div>
        <div class="title mt-2">Bodyweight {{ currentLifter.body_weight | displayKgs }}</div>

        <div class="ml-0 mt-3">
          <v-btn
            v-if="currentWeight"
            color="success"
            large
            class="mr-1"
            @click="saveLiftResult(currentLifter, currentLift, true)"
          >Good Lift</v-btn>
          <v-btn
            v-if="currentWeight"
            color="error"
            large
            class="mr-1"
            @click="saveLiftResult(currentLifter, currentLift, false)"
          >No Lift</v-btn>
          <v-btn
            v-if="currentWeight === null || currentWeight === 0"
            color="info"
            class="mr-1"
            @click="showWeightEntered"
          >Enter Next Attempt</v-btn>
          <enter-weight-dialog
            @weight-entered="nextAttemptEntered"
          />
          <v-btn 
            color="blue-grey" 
            class="mr-1 white--text" 
            @click="nextLifter">Next</v-btn>
        </div>

        <v-layout class="ml-2 mt-3">
          <v-flex 
            xs12>
            <v-select
              :items="lifts"
              v-model="currentLiftSelect"
              label="Current Lift"
              @change="liftChanged"
            />
          </v-flex>

          <v-flex 
            xs12 
            class="mx-2">
            <v-select
              v-model="currentFlightSelect"
              :items="flights"
              label="Flight"
              @change="flightChanged"
            />
          </v-flex>
        </v-layout>

        <plate-display 
          :weight="currentWeight"
          class="ml-2" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { spotterDb } from '~/services/dexieinit'
import liftNames from '~/utils/liftNameConstants'
import RunCompCell from '~/components/runcomp/runcompcell'
import RunCompLiftCell from '~/components/runcomp/runcompliftcell'
import { upperCase } from '~/filters/upperLowerCase'
import { displayKgs } from '~/filters/weightKg'
import PlateDisplay from '~/components/runcomp/platedisplay'
import EnterWeightDialog from '~/components/runcomp/enterweightdialog'
import {
  lifterTopSquat,
  lifterTopBench,
  lifterTopDeadlift,
  lifterSubTotal,
  lifterTotal,
  lifterWilks,
  sortLiftersByFlight
} from '~/utils/lifterUtils.js'
import { statsDash } from '~/filters/lifterStatsFilter.js'

export default {
  filters: {
    upperCase,
    displayKgs,
    lifterTopSquat,
    lifterTopBench,
    statsDash
  },

  components: {
    RunCompCell,
    RunCompLiftCell,
    PlateDisplay,
    EnterWeightDialog
  },

  data: () => ({
    highlightCellClassName: 'highlighted',
    liftNames: null,
    loading: false,
    lifters: [],
    sortedLifters: [],
    displaySquats: true,
    displayBench: false,
    displayDeadlift: false,
    currentLift: null,
    currentLifterIndex: null,
    flights: [],
    currentFlight: null,
    lifts: [
      liftNames.Squat1,
      liftNames.Squat2,
      liftNames.Squat3,
      liftNames.Bench1,
      liftNames.Bench2,
      liftNames.Bench3,
      liftNames.Deadlift1,
      liftNames.Deadlift2,
      liftNames.Deadlift3
    ]
  }),

  computed: {
    currentFlightSelect: {
      get: function() {
        return this.currentFlight
      },
      set: function(newValue) {
        this.currentFlight = newValue
        this.currentLifterIndex = 0
      }
    },
    currentLiftSelect: {
      get: function() {
        return this.currentLift
      },
      set: function(newValue) {
        this.currentLift = newValue
        this.currentLifterIndex = 0
      }
    },
    blockDialogTitle: function() {
      return this.addMode ? 'Add Block' : 'Edit Block'
    },
    currentLifter: function() {
      if (this.currentLifterIndex === null) return null

      return this.sortedLifters[this.currentLifterIndex]
    },
    currentWeight: function() {
      if (this.currentLifterIndex === null) return null

      let lifter = this.currentLifter

      let currentWeight = null
      switch (this.currentLift) {
        case liftNames.Squat1:
          currentWeight = !lifter.lifts.squat1
            ? null
            : lifter.lifts.squat1.weight
          break
        case liftNames.Squat2:
          currentWeight = !lifter.lifts.squat2
            ? null
            : lifter.lifts.squat2.weight
          break
        case liftNames.Squat3:
          currentWeight = !lifter.lifts.squat3
            ? null
            : lifter.lifts.squat3.weight
          break
        case liftNames.Bench1:
          currentWeight = !lifter.lifts.bench1
            ? null
            : lifter.lifts.bench1.weight
          break
        case liftNames.Bench2:
          currentWeight = !lifter.lifts.bench2
            ? null
            : lifter.lifts.bench2.weight
          break
        case liftNames.Bench3:
          currentWeight = !lifter.lifts.bench3
            ? null
            : lifter.lifts.bench3.weight
          break
        case liftNames.Deadlift1:
          currentWeight = !lifter.lifts.deadlift1
            ? null
            : lifter.lifts.deadlift1.weight
          break
        case liftNames.Deadlift2:
          currentWeight = !lifter.lifts.deadlift2
            ? null
            : lifter.lifts.deadlift2.weight
          break
        case liftNames.Deadlift3:
          currentWeight = !lifter.lifts.deadlift3
            ? null
            : lifter.lifts.deadlift3.weight
          break
      }

      return currentWeight
    },
    previousAttemptWeight: function() {
      if (!this.currentLift || this.currentLifterIndex === null) {
        return null
      }

      let lifter = this.currentLifter

      switch (this.currentLift) {
        case liftNames.Squat1:
          return null
        case liftNames.Squat2:
          let result = !lifter.lifts.squat1.weight
            ? null
            : lifter.lifts.squat1.weight
          return result
        case liftNames.Squat3:
          if (!lifter.lifts.squat2) return null
          return !lifter.lifts.squat2.weight ? null : lifter.lifts.squat2.weight
        case liftNames.Bench1:
          return null
        case liftNames.Bench2:
          if (!lifter.lifts.bench1) return null
          return !lifter.lifts.bench1.weight ? null : lifter.lifts.bench1.weight
        case liftNames.Bench3:
          if (!lifter.lifts.bench2) return null
          return !lifter.lifts.bench2.weight ? null : lifter.lifts.bench2.weight
        case liftNames.Deadlift1:
          return 0
        case liftNames.Deadlift2:
          if (!lifter.lifts.deadlift1) return null
          return !lifter.lifts.deadlift1.weight
            ? null
            : lifter.lifts.deadlift1.weight
        case liftNames.Deadlift3:
          if (!lifter.lifts.deadlift2) return null
          return !lifter.lifts.deadlift2.weight
            ? null
            : lifter.lifts.deadlift2.weight
      }

      return null
    }
  },

  created() {
    this.loading = true
    this.liftNames = liftNames
    this.currentLifterIndex = null
    this.currentLift = !this.$store.state.runcomp.runCompCurrentLift
      ? liftNames.Squat1
      : this.$store.state.runcomp.runCompCurrentLift
    this.currentFlight = !this.$store.state.runcomp.runCompCurrentFlight
      ? 'A'
      : this.$store.state.runcomp.runCompCurrentFlight

    this.displaySquats = this.isLiftSquat(this.currentLift)
    this.displayBench = this.isLiftBench(this.currentLift)
    this.displayDeadlift = this.isLiftDeadlift(this.currentLift)

    this.getFlights()
    this.getLiftersByFlight()
  },

  methods: {
    lifterTopSquat,
    lifterTopBench,
    lifterTopDeadlift,
    lifterSubTotal,
    lifterTotal,
    lifterWilks,
    sortLiftersByFlight,
    nextAttemptEntered: async function(result) {
      // TODO - update Firebase
      const weightNumeric = Number(result.weight)

      let lifter = this.sortedLifters.filter(x => x.id == result.lifterId)[0]

      switch (result.lift) {
        case liftNames.Squat1:
          if (!lifter.lifts.squat1) {
            lifter.lifts.squat1 = {}
          }
          lifter.lifts.squat1.goodlift = null
          lifter.lifts.squat1.weight = weightNumeric
          break
        case liftNames.Squat2:
          if (!lifter.lifts.squat2) {
            lifter.lifts.squat2 = {}
          }
          lifter.lifts.squat2.goodlift = null
          lifter.lifts.squat2.weight = weightNumeric
          break
        case liftNames.Squat3:
          if (!lifter.lifts.squat3) {
            lifter.lifts.squat3 = {}
          }
          lifter.lifts.squat3.goodlift = null
          lifter.lifts.squat3.weight = weightNumeric
          break
        case liftNames.Bench1:
          if (!lifter.lifts.bench1) {
            lifter.lifts.bench1 = {}
          }
          lifter.lifts.bench1.goodlift = null
          lifter.lifts.bench1.weight = weightNumeric
          break
        case liftNames.Bench2:
          if (!lifter.lifts.bench2) {
            lifter.lifts.bench2 = {}
          }
          lifter.lifts.bench2.goodlift = null
          lifter.lifts.bench2.weight = weightNumeric
          break
        case liftNames.Bench3:
          if (!lifter.lifts.bench3) {
            lifter.lifts.bench3 = {}
          }
          lifter.lifts.bench3.goodlift = null
          lifter.lifts.bench3.weight = weightNumeric
          break
        case liftNames.Deadlift1:
          if (!lifter.lifts.deadlift1) {
            lifter.lifts.deadlift1 = {}
          }
          lifter.lifts.deadlift1.goodlift = null
          lifter.lifts.deadlift1.weight = weightNumeric
          break
        case liftNames.Deadlift2:
          if (!lifter.lifts.deadlift2) {
            lifter.lifts.deadlift2 = {}
          }
          lifter.lifts.deadlift2.goodlift = null
          lifter.lifts.deadlift2.weight = weightNumeric
          break
        case liftNames.Deadlift3:
          if (!lifter.lifts.deadlift3) {
            lifter.lifts.deadlift3 = {}
          }
          lifter.lifts.deadlift3.goodlift = null
          lifter.lifts.deadlift3.weight = weightNumeric
          break
      }

      await spotterDb.lifters.update(result.lifterId, {
        lifts: lifter.lifts
      })
      await this.getLiftersByFlight()
    },
    isLiftSquat(liftName) {
      return (
        liftName === liftNames.Squat1 ||
        liftName === liftNames.Squat2 ||
        liftName === liftNames.Squat3
      )
    },
    isLiftBench(liftName) {
      return (
        liftName === liftNames.Bench1 ||
        liftName === liftNames.Bench2 ||
        liftName === liftNames.Bench3
      )
    },
    isLiftDeadlift(liftName) {
      return (
        liftName === liftNames.Deadlift1 ||
        liftName === liftNames.Deadlift2 ||
        liftName === liftNames.Deadlift3
      )
    },
    liftChanged: async function(event) {
      this.displaySquats = this.isLiftSquat(this.currentLift)
      this.displayBench = this.isLiftBench(this.currentLift)
      this.displayDeadlift = this.isLiftDeadlift(this.currentLift)
      this.$store.commit('runcomp/setRunCompCurrentLift', this.currentLift)
      await this.getLiftersByFlight()
    },
    flightChanged(event) {
      this.$store.commit('runcomp/setRunCompCurrentFlight', this.currentFlight)
    },
    getLiftersByFlight: async function() {
      let allLifters = await spotterDb.lifters
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()

      this.sortedLifters.length = 0
      this.sortedLifters = this.sortLiftersByFlight(
        allLifters,
        this.currentFlight,
        this.currentLift
      )

      this.currentLifterIndex = this.sortedLifters.length > 0 ? 0 : null

      this.loading = false
    },
    getFlights: async function() {
      const lifters = await spotterDb.lifters
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()

      this.flights = Array.from(
        new Set(
          lifters
            .sort((a, b) => {
              if (!a) return 0
              if (!b) return 1
              if (a.flight !== b.flight) {
                return a.flight < b.flight ? -1 : 1
              }
              return a.flight_index - b.flight_index
            })
            .map(x => x.flight)
        )
      )
      this.currentFlight = this.flights.length > 0 ? this.flights[0] : null
    },
    deleteBlock() {
      if (this.editBlock === null) return
      this.deleteWaiting = true
    },
    liftIsGoodLift(status) {
      const isGoodLift = status === true ? 'yes' : status === null ? '' : 'no'
      return isGoodLift
    },
    nextLifter(event, stayWithlift) {
      if (this.currentLifterIndex + 1 >= this.sortedLifters.length) {
        if (stayWithlift) {
          this.currentLifterIndex = 0
        } else {
          let liftIndex = this.lifts.indexOf(this.currentLift)
          if (liftIndex >= 0 && liftIndex < this.lifts.length) {
            this.currentLift = this.lifts[liftIndex + 1]
            this.currentLifterIndex = 0
          }
        }
      } else {
        this.currentLifterIndex += 1
      }
    },
    highlightHeader(lift) {
      let className = ''
      if (this.currentLift === lift) {
        className = this.highlightCellClassName
      }

      return className
    },
    highlightCell(lifter) {
      if (lifter) {
        return this.sortedLifters[this.currentLifterIndex] === lifter
          ? this.highlightCellClassName
          : ''
      }

      return ''
    },
    isCurrentOrPreviousLifter(lifter) {
      return this.sortedLifters.indexOf(lifter) <= this.currentLifterIndex
    },
    isCurrentLifter(lifter) {
      return this.sortedLifters.indexOf(lifter) === this.currentLifterIndex
    },
    saveLiftResult: async function(lifter, lift, result) {
      if (lifter === null || lift === null) {
        return
      }

      let goodlift = result ? 'yes' : 'no'

      switch (lift) {
        case liftNames.Squat1:
          lifter.lifts.squat1.goodlift = goodlift
          break
        case liftNames.Squat2:
          lifter.lifts.squat2.goodlift = goodlift
          break
        case liftNames.Squat3:
          lifter.lifts.squat3.goodlift = goodlift
          break
        case liftNames.Bench1:
          lifter.lifts.bench1.goodlift = goodlift
          break
        case liftNames.Bench2:
          lifter.lifts.bench2.goodlift = goodlift
          break
        case liftNames.Bench3:
          lifter.lifts.bench3.goodlift = goodlift
          break
        case liftNames.Deadlift1:
          lifter.lifts.deadlift1.goodlift = goodlift
          break
        case liftNames.Deadlift2:
          lifter.lifts.deadlift2.goodlift = goodlift
          break
        case liftNames.Deadlift3:
          lifter.lifts.deadlift3.goodlift = goodlift
          break

        default:
          return
      }

      console.log(lifter.id)
      await spotterDb.lifters.update(lifter.id, {
        lifts: lifter.lifts
      })

      this.nextLifter()
    },
    showWeightEntered() {
      this.$store.commit('weightdialog/lift', this.currentLift)
      this.$store.commit('weightdialog/show', this.currentLifter)
    }
  }
}
</script>

<style>
table.v-table tbody td:not(:nth-child(1)) {
  padding: 0 12px;
}
table.v-table thead th:not(:nth-child(1)) {
  padding: 0 12px;
}
.highlighted {
  background-color: #9595955c;
}
</style>
