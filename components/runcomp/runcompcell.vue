<template>
  <td :class="cellClass">
    <slot/>
  </td>
</template>

<script>
export default {
  name: 'RunCompLiftCell',
  props: {
    highlighted: {
      type: Boolean,
      default: false
    },
    goodLift: {
      type: [String],
      default: null
    },
    minPadding: {
      type: Boolean,
      default: false
    },
    centerContent: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    cellClass: function() {
      let newCellClass = ''
      if (this.goodLift === 'no') {
        newCellClass = 'red darken-2 white--text'
      } else if (this.goodLift === 'yes') {
        newCellClass = 'green darken-2 white--text'
      } else if (this.highlighted) {
        newCellClass = 'highlighted'
      }

      if (this.minPadding) {
        newCellClass += ' px-0'
      }

      if (this.centerContent && !newCellClass.includes('text-xs-center')) {
        newCellClass += ' text-xs-center'
      }

      return newCellClass
    }
  }
}
</script>

<style>
.highlighted {
  background-color: #9595955c;
}
</style>
