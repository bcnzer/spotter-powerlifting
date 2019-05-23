<template>
  <v-select
    v-model="lifterSelectedGender"
    :rules="[v => (v !== null) || 'Gender is required']"
    :items="lifterGenders"
    item-text="gender"
    label="Gender"
    required
    @change="genderSelected"
  />
</template>

<script>
export default {
  name: 'GenderSelect',

  props: {
    currentGender: {
      type: String,
      default: null
    }
  },

  data: () => ({
    lifterGenders: ['Male', 'Female'],
    selectedGender: null
  }),

  computed: {
    lifterSelectedGender: {
      get() {
        return this.currentGender
      },
      set(value) {
        this.selectedGender = value
      }
    }
  },

  methods: {
    genderSelected: function() {
      this.$emit('gender-selected', selectedGender)
    }
  }
}
</script>
