<template>
  <v-hover class="ma-2">
    <v-card
      slot-scope="{ hover }"
      :class="`elevation-${hover ? 12 : 2}`"
      width="300"
    >
      <v-img
        :alt="fullName"
        :src="imgPath"
        max-width="256"
        class="mx-auto" />
      <v-card-title>
        <v-flex xs8>
          <span class="heading">{{ combinedName }}</span>
        </v-flex>
        <v-flex xs4>
          <v-btn
            primary
            color="primary"
            @click="click()">
            Select
          </v-btn>
        </v-flex>
      </v-card-title>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'FederationTile',

  props: {
    name: {
      type: String,
      default: null
    },
    fullName: {
      type: String,
      default: null
    },
    imgPath: {
      type: String,
      default: null
    }
  },

  computed: {
    combinedName: function() {
      return `${this.fullName} (${this.name})`
    }
  },

  methods: {
    click: function() {
      this.$emit('federation-clicked')
    }
  }
}
</script>
