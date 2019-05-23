<template>
  <v-btn
    style="height: 204px; width: 296px"
    class="mb-3"
    @click="showCreateCompDialog = true">
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
      <create-comp-dialog
        :show-dialog="showCreateCompDialog"
        @close-dialog="onCloseDialog"
        @save-dialog="onSaveDialog" />
    </v-layout>
  </v-btn>
</template>

<script>
import CreateCompDialog from './createcompdialog'

export default {
  name: 'NewCompTile',

  components: {
    CreateCompDialog
  },

  data: () => ({
    showCreateCompDialog: false
  }),

  methods: {
    onCloseDialog: function() {
      this.showCreateCompDialog = false
    },
    onSaveDialog: function(compName) {
      this.showCreateCompDialog = false
      const newCompName = compName
      this.$emit('new-comp', newCompName)
    },
    showDialog: function() {
      this.showCreateCompDialog = true
    }
  }
}
</script>
