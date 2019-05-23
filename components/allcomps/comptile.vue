<template>
  <v-btn
    style="height: 204px; width: 296px"
    class="mb-3"
    @click="click()">
    <v-layout
      column
      align-center
      justify-start>
      <div
        class="pa-4"
        style="text-transform: none">
        <h2>{{ name }}</h2>
        <h3>{{ date }}</h3>
        <h3>{{ location }}</h3>
      </div>
    </v-layout>
  </v-btn>
</template>

<script>
export default {
  name: 'CompTile',

  props: {
    name: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    date: {
      type: String,
      default: null
    },
    location: {
      type: String,
      default: null
    }
  },

  data: () => ({
    showCreateCompDialog: false
  }),

  methods: {
    click: function() {
      this.$emit('comp-clicked')
    }
  }
}
</script>
