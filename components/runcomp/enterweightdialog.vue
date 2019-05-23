<template>
  <v-layout
    row
    justify-center>
    <v-dialog
      v-if="lifter"
      v-model="showWeightDialog"
      max-width="500px"
      persistent>
      <v-card>
        <v-card-text>
          <v-flex xs12>
            <div class="headline">{{ lifter.last_name | upperCase }} {{ lifter.first_name }}</div>
          </v-flex>
          <v-flex xs12>
            <div class="headline">{{ weightDialogLiftType }}</div>
          </v-flex>
          <v-form
            ref="form" 
            v-model="valid"
            lazy-validation>
            <v-text-field 
              :label="minimumWeightText" 
              :rules="[v => (v !== null && v > 0 && v >= minimumWeight) || `Please enter a weight greater than ${minimumWeight}`]"
              v-model="weightDialogWeight" 
              required/>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer/>
          <v-btn 
            color="blue darken-1" 
            flat
            @click.native="useMinimumWeight">
            Use minimum weight
          </v-btn>
          <v-btn 
            color="blue darken-1" 
            flat
            @click.native="saveWeight">
            Save
          </v-btn>
          <v-btn 
            color="blue darken-1" 
            flat
            @click.native="closeDialog">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { upperCase } from '~/filters/upperLowerCase'
import { mapGetters } from 'vuex'
import liftNames from '~/utils/liftNameConstants'
import { CurrentComp } from '~/utils/indexedDbHelpers'
import { spotterDb } from '~/services/dexieinit'

export default {
  name: 'EnterWeightDialog',

  filters: {
    upperCase
  },

  data: () => ({
    valid: false,
    weight: null,
    weightIncrement: 2.5
  }),

  computed: {
    lifter: function() {
      return this.$store.state.weightdialog.weightDialogLifter
    },
    showWeightDialog: function() {
      return this.$store.state.weightdialog.isWeightDialogVisible
    },
    weightDialogLiftType: function() {
      return this.$store.state.weightdialog.weightDialogLiftType
    },
    weightDialogWeight: {
      get() {
        return this.$store.state.weightdialog.weightDialogWeight
      },
      set(value) {
        this.weight = value
      }
    },
    minimumWeightText: function() {
      return `Minimum next weight: ${this.minimumWeight.toString()}`
    },
    minimumWeight: function() {
      if (this.$store.state.weightdialog.weightDialogLifter === null) {
        return ''
      }

      const lifter = this.$store.state.weightdialog.weightDialogLifter
      const lift = this.$store.state.weightdialog.weightDialogLiftType

      let minimumWeight = 0
      let incrementWeight = false
      if (lift === liftNames.Squat3) {
        minimumWeight = lifter.lifts.squat2.weight
        incrementWeight = lifter.lifts.squat2.goodlift != 'no'
      } else if (lift === liftNames.Squat2) {
        minimumWeight = lifter.lifts.squat1.weight
        incrementWeight = lifter.lifts.squat1.goodlift != 'no'
      } else if (lift === liftNames.Bench3) {
        minimumWeight = lifter.lifts.bench2.weight
        incrementWeight = lifter.lifts.bench2.goodlift != 'no'
      } else if (lift === liftNames.Bench2) {
        minimumWeight = lifter.lifts.bench1.weight
        incrementWeight = lifter.lifts.bench1.goodlift != 'no'
      } else if (lift === liftNames.Deadlift3) {
        minimumWeight = lifter.lifts.deadlift2.weight
        incrementWeight = lifter.lifts.deadlift2.goodlift != 'no'
      } else if (lift === liftNames.Deadlift2) {
        minimumWeight = lifter.lifts.deadlift1.weight
        incrementWeight = lifter.lifts.deadlift1.goodlift != 'no'
      }

      if (minimumWeight === 0) {
        return ''
      }

      if (incrementWeight) {
        minimumWeight += this.weightIncrement
      }
      return minimumWeight
    }
  },

  async created() {
    const comp = await CurrentComp(this.$route.params.id)
    const fed = await spotterDb.federations
      .where('name')
      .equals(comp.federation.toUpperCase())
      .first()

    this.weightIncrement = fed.weight_increment
  },

  methods: {
    save: function() {
      const result = {
        lifterId: this.$store.state.weightdialog.weightDialogLifter.id,
        lift: this.$store.state.weightdialog.weightDialogLiftType,
        weight: this.weight
      }
      console.log(this.$store.state.weightdialog.weightDialogLifter.id)
      this.weight = null
      this.$store.commit('weightdialog/close')
      this.$emit('weight-entered', result)
      this.$refs.form.reset()
    },
    useMinimumWeight: function() {
      this.weight = this.minimumWeight
      this.save()
    },
    saveWeight: function() {
      if (this.$refs.form.validate()) {
        this.save()
      }
    },
    closeDialog: function() {
      this.weight = null
      this.$store.commit('weightdialog/close')
      this.$refs.form.reset()
    }
  }
}
</script>
