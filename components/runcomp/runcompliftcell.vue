<template>
  <run-comp-cell 
    :highlighted="isHighlighted"
    :good-lift="goodLiftMsg"
    :min-padding="!showValue && showButtonIfEmpty">
    <div
      v-if="showValue">
      <v-btn 
        :class="weightClass"
        :style="`padding: 0 0px; margin: 0px; min-width: 50px; ${!lift.goodlift ? '' : 'color: white;'}`"
        flat 
        @click.native.stop="showWeightEntryDialog()">
        {{ liftWeight }}
      </v-btn>
      <!-- {{ liftWeight }} <span v-if="recordAttempt">R</span> -->
    </div>
    <div
      v-if="!showValue && showButtonIfEmpty" 
      class="text-xs-center">
      <v-btn 
        :class="weightClass"
        flat 
        @click.native.stop="showWeightEntryDialog()"> - </v-btn>
    </div>
  </run-comp-cell>
</template>

<script>
import RunCompCell from './runcompcell'
import liftNames from '~/utils/liftNameConstants'

export default {
  name: 'RunCompLiftCell',

  components: {
    RunCompCell
  },

  props: {
    lifter: {
      type: [Object],
      default: null
    },
    lift: {
      type: [Object],
      default: null
    },
    isRecordAttempt: {
      type: [Boolean],
      default: false
    },
    showButtonIfEmpty: {
      type: Boolean,
      default: true
    },
    passed: {
      type: [String, Boolean],
      default: null
    },
    highlighted: {
      type: Boolean,
      default: false
    },
    isCurrentWeight: {
      type: Boolean,
      default: false
    },
    previousAttemptWeight: {
      type: Number,
      default: null
    },
    currentLiftType: {
      type: String,
      default: null
    },
    liftWeight: {
      type: [String, Number],
      default: null
    }
  },

  computed: {
    showValue: function() {
      if (this.liftWeight) {
        return true
      }
      return false
    },
    recordAttempt: function() {
      if (!this.lift) return false
      return this.lift.record_attempt
    },
    goodLiftMsg: function() {
      let goodlift = null
      switch (this.currentLiftType) {
        case liftNames.Squat1:
          if (this.lifter.lifts.squat1) {
            goodlift = this.lifter.lifts.squat1.goodlift
          }
          break
        case liftNames.Squat2:
          if (this.lifter.lifts.squat2) {
            goodlift = this.lifter.lifts.squat2.goodlift
          }
          break
        case liftNames.Squat3:
          if (this.lifter.lifts.squat3) {
            goodlift = this.lifter.lifts.squat3.goodlift
          }
          break
        case liftNames.Bench1:
          if (this.lifter.lifts.bench1) {
            goodlift = this.lifter.lifts.bench1.goodlift
          }
          break
        case liftNames.Bench2:
          if (this.lifter.lifts.bench2) {
            goodlift = this.lifter.lifts.bench2.goodlift
          }
          break
        case liftNames.Bench3:
          if (this.lifter.lifts.bench3) {
            goodlift = this.lifter.lifts.bench3.goodlift
          }
          break
        case liftNames.Deadlift1:
          if (this.lifter.lifts.deadlift1) {
            goodlift = this.lifter.lifts.deadlift1.goodlift
          }
          break
        case liftNames.Deadlift2:
          if (this.lifter.lifts.deadlift2) {
            goodlift = this.lifter.lifts.deadlift2.goodlift
          }
          break
        case liftNames.Deadlift3:
          if (this.lifter.lifts.deadlift3) {
            goodlift = this.lifter.lifts.deadlift3.goodlift
          }
          break
      }
      return goodlift
    },
    isHighlighted: function() {
      return this.highlighted
    },
    weightClass: function() {
      return (
        'text-xs-center weight-button-cell' +
        (this.isCurrentWeight ? ' subheading selectedWeight' : '')
      )
    }
  },

  methods: {
    closeSnackbar() {
      this.showSnackbar = false
    },
    showWeightEntryDialog() {
      console.log(`lift weight ${this.liftWeight}`)
      this.$store.commit('weightdialog/lift', this.currentLiftType)
      this.$store.commit('weightdialog/weight', this.liftWeight)
      this.$store.commit('weightdialog/show', this.lifter)
    }
  }
}
</script>

<style>
.selectedWeight {
  font-weight: bold;
}
.weight-button-cell {
  padding: 0 0px;
  margin: 0px;
  min-width: 50px;
  font-weight: 400;
}
.weight-button-white-text {
  color: white;
}
</style>
