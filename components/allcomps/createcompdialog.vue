<template>
  <v-dialog
    v-model="showDialog"
    persistent 
    max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Create Competition</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="compName"
          label="Competition name"
          required />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          color="primary"
          @click="close">
          Close
        </v-btn>
        <v-btn
          :disabled="!validCompName"
          flat
          color="info"
          @click="save">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CreateComp',

  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    compName: null
  }),

  computed: {
    validCompName: function() {
      return (
        this.compName !== null &&
        this.compName.trim() !== '' &&
        this.compName.length > 3
      )
    }
  },

  methods: {
    close: function() {
      this.compName = null
      this.$emit('close-dialog')
    },
    save: function() {
      const name = this.compName
      this.compName = null
      this.$emit('save-dialog', name)
    }
  }
}
</script>
