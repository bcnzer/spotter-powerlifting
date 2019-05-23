<template>
  <v-dialog
    ref="timeDialog"
    v-model="modal"
    :return-value.sync="dialogTime"
    persistent
    lazy
    full-width
    width="290px"
  >
    <v-text-field
      slot="activator"
      v-model="propModel"
      :label="textLabel"
      prepend-icon="access_time"
      readonly
    />
    <v-time-picker
      v-model="propModel"
      scrollable>
      <v-spacer />
      <v-btn
        flat
        color="primary"
        @click="modal = false">
        Cancel
      </v-btn>
      <v-btn
        flat
        color="primary"
        @click="saveTime()">
        OK
      </v-btn>
    </v-time-picker>
  </v-dialog>
</template>

<script>
export default {
  name: 'TimePicker',

  props: {
    textLabel: {
      type: String,
      default: null
    },
    time: {
      type: String,
      default: null
    }
  },

  data: () => ({
    modal: false,
    dialogTime: null
  }),

  computed: {
    propModel: {
      get() {
        return this.time
      },
      set(value) {
        this.dialogTime = value
      }
    },

    modelDialogTime: function() {
      return this.dialogTime
    }
  },

  methods: {
    saveTime: function() {
      this.modal = false
      this.$emit('time-saved', this.dialogTime)
    }
  }
}
</script>
