<template>
  <v-container
    v-if="!loading && !noLifters"
    fluid
    grid-list-xl>
    <locked-comp :show="isCompLocked" />

    <v-layout row>
      <v-flex>
        <v-btn
          :disabled="isCompLocked"
          color="info"
          @click="autoAssignFlights">
          Flights - auto-assign all lifters
        </v-btn>
        <v-tooltip
          bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              :disabled="isCompLocked"
              color="info"
              v-on="on"
              @click="autoAssignLotNumbers()">
              Lot Numbers - assign to all lifters
            </v-btn>
          </template>
          <span>{{ lotNumberTooltip }}</span>
        </v-tooltip>
        <!-- <v-btn
          color="info"
          @click="autoAssignLotNumbers">
          Lot Numbers - assign to all lifters
        </v-btn> -->
      </v-flex>
    </v-layout>

    <v-layout
      row
      style="overflow: auto;">

      <v-card
        v-for="flight in flights"
        :key="flight.flightName"
        class="mx-2 my-2 px-3 py-3"
        color="grey lighten-3"
        style="max-width: 300px; min-width:250px;">
        <v-layout row>
          <v-flex xs8>
            <h3
              v-if="flight.flightName === 'Uncategorized'"
              class="px-1 py-2">
              Uncategorized
            </h3>
            <h3
              v-else
              class="px-1 py-2">
              Flight {{ flight.flightName }}
            </h3>
          </v-flex>
          <v-flex xs4>
            <div class="text-xs-right">
              <v-avatar
                class="amber"
                size="32">
                <span class="black--text">{{ lifterCount(flight.lifters) }}</span>
              </v-avatar>
            </div>
          </v-flex>
        </v-layout>

        <draggable
          :disabled="isCompLocked"
          :list="flight.lifters"
          :move="checkMove"
          group="flights"
          @end="endDrag">
          <transition-group
            :id="flight.flightName"
            class="list-complete-item">
            <v-card
              v-for="lifter in flight.lifters"
              :key="lifter.id" 
              :color="cardColour(lifter)"
              :dark="cardDark(lifter)"
              :id="lifter.id"
              class="my-2 list-complete-item">
              <v-card-text primary-title>
                <div>
                  <div class="title mb-1">{{ lifter.last_name | upperCase }}</div>
                  <div class="subheading mb-1">{{ lifter.first_name }}</div>
                  <div>{{ cardDetails(lifter) }}</div>
                </div>
              </v-card-text>
            </v-card>

            <v-card
              v-if="flight.lifters.length === 0"
              id="-1"
              :key="-1"
              class="my-2 list-complete-item"
              color="grey darken-1"
              dark>
              <v-card-text primary-title>
                <div class="title mb-1">No lifters</div>
              </v-card-text>
            </v-card>
          </transition-group>
        </draggable>
      </v-card>

      <v-flex>
        <v-tooltip bottom>
          <v-btn 
            slot="activator"
            :disabled="isCompLocked"
            class="amber"
            fab
            dark
            @click="addFlight">
            <v-icon>add</v-icon>
          </v-btn>
          <span>Create Flight</span>
        </v-tooltip>
      </v-flex>  
    </v-layout>
    <v-dialog
      v-model="lotNumberWarningDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Lot Numbers</v-card-title>
        <v-card-text>
          All lifters must be assigned to a flight before lot numbers can be assigned
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            flat="flat"
            @click="lotNumberWarningDialog = false"
          >
            ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <v-container v-else>
    <v-layout
      column
      justify-center
      align-center>
      <v-flex xs12>
        <div
          v-if="noLifters"
          class="title mt-5">
          Please add lifters before defining flights
        </div>
        <v-progress-circular
          v-if="loading && !noLifters"
          :size="100"
          indeterminate
          color="primary"
          class="mt-5"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LockedComp from '~/components/lockedcomp/lockedcomp'
import { CurrentComp } from '~/utils/indexedDbHelpers'
import draggable from 'vuedraggable'
import { upperCase } from '~/filters/upperLowerCase'
import { spotterDb } from '~/services/dexieinit'
import { firestore } from '~/services/fireinit.js'
import * as firebase from 'firebase/app'

export default {
  components: {
    LockedComp,
    draggable
  },

  filters: {
    upperCase
  },

  data: () => ({
    isCompLocked: false,
    loading: true,
    noLifters: true,
    lotNumberWarningDialog: false,
    flights: [
      {
        flightName: 'Uncategorized',
        lifters: []
      }
    ]
  }),

  computed: {
    dragOptions: function() {
      return {
        group: 'description'
      }
    },
    lotNumberTooltip: function() {
      if (
        this.flights[0].flightName === 'Uncategorized' &&
        this.flights[0].lifters.length > 0
      ) {
        return 'All lifters must first be assigned to a flight'
      }
      return null
    }
  },

  async created() {
    const comp = await CurrentComp(this.$route.params.id)
    this.isCompLocked = comp.locked

    await this.loadFlights()
  },

  methods: {
    cardDetails: function(lifter) {
      let details = `${lifter.weight_class} - ${lifter.division_name} - 
        ${lifter.gender}`
      if (lifter.lot_number) {
        details += ` LN ${lifter.lot_number}`
      }
      return details
    },
    autoAssignFlights: async function() {
      this.loading = true
      const result = await spotterDb.comps
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()
      if (result.length != 1) return

      const compId = result[0].id

      // Get the actual lifters
      let lifters = await spotterDb.lifters
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()

      // Sort them all, first by gender and then by weight
      lifters = lifters.sort((a, b) => {
        if (a.gender !== b.gender) {
          return a.gender === 'Female' ? -1 : 1
        } else {
          // Replacing + for weight classes like 84+, to ensure they're last
          const weightClassA = parseInt(
            a.weight_class.replace(' kg', '').replace('+', '0'),
            10
          )
          const weightClassB = parseInt(
            b.weight_class.replace(' kg', '').replace('+', '0'),
            10
          )
          if (weightClassA === weightClassB) return 0
          return weightClassA < weightClassB ? -1 : 1
        }
      })
      // console.table(lifters, ['first_name', 'gender', 'weight_class'])

      // Not put them all in flights
      let currentFlight = 'A'
      let count = 0

      this.flights.length = 0
      this.flights.push({
        flightName: currentFlight,
        lifters: []
      })
      let currentFlightLifters = this.flights[0].lifters
      let batch = firestore.batch()

      // Now make the change for each lifter
      lifters.forEach(lifter => {
        // Limit is a hard 14 for the time being for a flight
        if (count >= 14) {
          // Known limitation that it will go beyond Z but no comp should have that many flights
          if (currentFlight === 'Z') {
            this.$sentry.captureException(
              new Error('Flight went beyond the letter Z')
            )
          }
          count = 0
          currentFlight = String.fromCharCode(currentFlight.charCodeAt(0) + 1)
          this.flights.push({
            flightName: currentFlight,
            lifters: []
          })
          currentFlightLifters = this.flights[this.flights.length - 1].lifters
        }

        currentFlightLifters.push(lifter)
        lifter.flight = currentFlight
        lifter.flight_index = count

        // Update the Firebase record for the lifter
        let lifterRef = firestore
          .collection('comps')
          .doc(compId)
          .collection('lifters')
          .doc(lifter.id)

        let flightInfo = {
          flight: currentFlight,
          flight_index: count
          // flight: firebase.firestore.FieldValue.delete(),
          // flight_index: firebase.firestore.FieldValue.delete(),
          // lot_number: firebase.firestore.FieldValue.delete()
        }
        batch.update(lifterRef, flightInfo)
        spotterDb.lifters.update(lifter.id, flightInfo)

        count += 1
      })
      // console.table(lifters, ['first_name', 'flight', 'gender', 'weight_class'])

      await batch.commit()

      this.loading = false
      this.autoAssignLotNumbers()
    },
    autoAssignLotNumbers: async function() {
      if (
        this.flights[0].flightName == 'Uncategorized' &&
        this.flights[0].lifters.length > 0
      ) {
        this.lotNumberWarningDialog = true
        return
      }

      this.loading = true

      // We need to assign each person a random number but we need to do it
      // in groups, by flight. So lifters flight A will be 1-14, etc
      const lifters = await spotterDb.lifters
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()

      const flights = this.distinctFlights(lifters)
      let offset = 1
      flights.forEach(flight => {
        let liftersByFlight = lifters.filter(x => x.flight === flight)
        this.shuffleArray(liftersByFlight, offset)
        offset += liftersByFlight.length
      })
      // console.table(lifters, ['first_name', 'flight', 'lot_number'])

      const result = await spotterDb.comps
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()
      if (result.length != 1) return

      const compId = result[0].id
      // Update Firebase
      let batch = firestore.batch()
      lifters.forEach(lifter => {
        let lifterRef = firestore
          .collection('comps')
          .doc(compId)
          .collection('lifters')
          .doc(lifter.id)

        let lotNumberToSet = {
          lot_number: lifter.lot_number
        }
        batch.update(lifterRef, lotNumberToSet)
        spotterDb.lifters.update(lifter.id, lotNumberToSet)
      })
      await batch.commit()

      await this.loadFlights()
      this.loading = false
    },
    shuffleArray: function(array, offset) {
      // Shuffle the array https://stackoverflow.com/a/12646864/4016263
      let myArray = array
      for (let i = myArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = myArray[i]
        myArray[i] = myArray[j]
        myArray[j] = temp
      }

      // Then store the new property, which is just the index + offset
      for (let index = 0; index < myArray.length; index++) {
        myArray[index].lot_number = index + offset
      }
    },
    distinctFlights: function(lifters) {
      return new Set(
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
    },
    loadFlights: async function() {
      this.loading = true
      const result = await spotterDb.lifters
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()

      this.noLifters = result.length === 0

      let distinctFlights = this.distinctFlights(result)

      let lifterFlights = []
      distinctFlights.forEach(flight => {
        let flightName = flight
        if (!flight) {
          flightName = 'Uncategorized'
        }
        lifterFlights.push({
          flightName: flightName,
          lifters: result.filter(lifter => lifter.flight == flight)
        })
      })

      this.flights.length = 0
      this.flights = lifterFlights
      this.loading = false
    },
    addFlight: function() {
      if (this.flights === null || this.flights.length === 0) return
      let nextFlightLetter = 'A'
      if (
        this.flights[this.flights.length - 1].flightName !== 'Uncategorized'
      ) {
        nextFlightLetter = String.fromCharCode(
          this.flights[this.flights.length - 1].flightName.charCodeAt() + 1
        )

        let newFlight = {
          flightName: nextFlightLetter,
          lifters: []
        }
        this.flights.push(newFlight)
      }
    },
    cardColour: function(lifter) {
      if (lifter.gender === 'Female') {
        switch (lifter.weight_class) {
          case '47 kg':
            return 'orange lighten-4'
          case '52 kg':
            return 'orange lighten-3'
          case '57 kg':
            return 'orange lighten-2'
          case '63 kg':
            return 'orange darken-1'
          case '72 kg':
            return 'orange darken-2'
          case '84 kg':
            return 'orange darken-3'
          case '84+ kg':
            return 'orange darken-4'
          default:
            return 'orange lighten-2'
        }
      } else {
        switch (lifter.weight_class) {
          case '47 kg':
            return 'blue lighten-4'
          case '59 kg':
            return 'blue lighten-3'
          case '66 kg':
            return 'blue lighten-2'
          case '74 kg':
            return 'blue lighten-1'
          case '83 kg':
            return 'blue'
          case '93 kg':
            return 'blue darken-1'
          case '105 kg':
            return 'blue darken-2'
          case '120 kg':
            return 'blue darken-3'
          case '120+ kg':
            return 'blue darken-4'
          default:
            return 'blue lighten-1'
        }
      }
    },
    cardDark: function(lifter) {
      if (!lifter.genderMale) {
        switch (lifter.weightClassName) {
          case '63 kg':
          case '72 kg':
          case '84 kg':
          case '84+ kg':
            return true
          default:
            return false
        }
      } else {
        switch (lifter.weightClassName) {
          case '93 kg':
          case '105 kg':
          case '120 kg':
          case '120+ kg':
            return true
          default:
            return false
        }
      }
    },
    checkMove: function(evt) {
      return evt.dragged.id !== null && evt.dragged.id !== -1
    },
    endDrag: async function(event) {
      const result = await spotterDb.comps
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()
      if (result.length != 1) return

      const compId = result[0].id

      let batch = firestore.batch()

      // Update the flight index of all the lifters in the previous array
      const previousFlight = this.flights.filter(
        x => x.flightName === event.from.id
      )[0].lifters

      let index = 0
      previousFlight.forEach(lifter => {
        let lifterRef = firestore
          .collection('comps')
          .doc(compId)
          .collection('lifters')
          .doc(lifter.id)

        let flightIndex = {
          flight_index: index
        }
        batch.update(lifterRef, flightIndex)
        spotterDb.lifters.update(lifter.id, flightIndex)
        index += 1
      })

      // Update the current flight of indexes
      const targetFlight = this.flights.filter(
        x => x.flightName === event.to.id
      )[0].lifters

      index = 0
      targetFlight.forEach(lifter => {
        let lifterRef = firestore
          .collection('comps')
          .doc(compId)
          .collection('lifters')
          .doc(lifter.id)

        if (event.item.id == lifter.id) {
          // Update both the index and the flight in this case
          let flightData = {
            flight_index: index,
            flight: event.to.id
          }
          batch.update(lifterRef, flightData)
          spotterDb.lifters.update(lifter.id, flightData)
        } else {
          // For everything else just update the index
          let flightIndex = {
            flight_index: index
          }
          batch.update(lifterRef, flightIndex)
          spotterDb.lifters.update(lifter.id, flightIndex)
        }

        index += 1
      })

      await batch.commit()
    },
    lifterCount: function(lifters) {
      if (lifters === null) return 0
      return lifters.length
    }
  }
}
</script>

<style>
.list-complete-item {
  transition: all 0.8s;
}

.list-complete-leave-active {
  opacity: 0;
}
</style>
