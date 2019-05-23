<template>
  <v-stepper
    v-model="stepIndex"
    vertical
    class="mx-3">
    <v-stepper-step
      :complete="stepIndex > 1"
      editable
      step="1">
      Competition Name and Date
      <small v-if="stepOneComplete">{{ compNameAndDate }}</small>
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-form
        ref="formOne"
        v-model="validForm"
        lazy-validation
        style="max-width: 500px">
        <v-text-field
          v-model="compName"
          :rules="[v => !!v || 'Competition Name is required']"
          label="Competition Name"
          required />

        <v-dialog
          ref="compStartDateDialog"
          v-model="modalStartDate"
          :return-value.sync="compStartDate"
          persistent
          lazy
          full-width
          width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="compStartDate"
            :rules="[v => !!v || 'Competition Start Date is required']"
            label="Comp Start Date"
            prepend-icon="event"
            required
            readonly
          />
          <v-date-picker
            v-model="compStartDate"
            scrollable>
            <v-spacer />
            <v-btn
              flat
              color="primary"
              @click="modalStartDate = false">
              Cancel
            </v-btn>
            <v-btn
              flat
              color="primary"
              @click="$refs.compStartDateDialog.save(compStartDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-form>
      <v-btn
        color="primary"
        @click="validateStepOne">
        Continue
      </v-btn>
      <v-btn
        flat
        @click="onCancelClick">
        Cancel
      </v-btn>
    </v-stepper-content>

    <v-stepper-step 
      :complete="stepIndex >= 2" 
      :editable="stepIndex >= 2"
      step="2">
      Federation ruleset this comp will use
      <small v-if="fedName">{{ fedName }}</small>
    </v-stepper-step>

    <v-stepper-content step="2">  
      <v-layout
        wrap
        row>
        <federation-tile
          v-for="fed in federations"
          :key="fed.name"
          :full-name="fed.fullName"
          :name="fed.name"
          :img-path="fed.img_path"
          @federation-clicked="onFederationClicked(fed)" />
      </v-layout>
    </v-stepper-content>

    <v-stepper-step 
      :complete="stepIndex >= 3" 
      :editable="stepIndex >= 3"
      step="3">
      Confirm
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-btn
        :loading="saving"
        color="primary"
        @click="onNewComp">
        Create Competition
      </v-btn>
      <v-btn
        flat
        @click="onCancelClick">
        Cancel
      </v-btn>
    </v-stepper-content>

  </v-stepper>
</template>

<script>
import { firestore } from '@/services/fireinit.js'
import { spotterDb } from '~/services/dexieinit'
import uuidv4 from 'uuid/v4'
import moment from 'moment-timezone'
import federationTile from '~/components/newcomp/federationTile'

export default {
  layout: 'allcomps',

  components: {
    federationTile
  },

  data: () => ({
    saving: false,
    federations: [],
    selectedFederation: null,
    stepIndex: 1,
    compName: null,
    compStartDate: null,
    validForm: null,
    modalStartDate: false,
    stepOneComplete: false
  }),

  computed: {
    compNameAndDate: function() {
      return `${this.compName} - ${this.compStartDate}`
    },
    fedName: function() {
      if (!this.selectedFederation) return null
      return `
        ${this.selectedFederation.fullName} (${this.selectedFederation.name})
      `
    }
  },

  async created() {
    const uid = localStorage.currentUser
    if (!uid) {
      this.$router.push(`/logout`)
    }
  },

  mounted: async function() {
    this.federations = await spotterDb.federations.toArray()
  },

  methods: {
    onFederationClicked: function(fed) {
      this.selectedFederation = fed
      this.stepIndex = 3
    },
    onCancelClick: function() {
      this.$router.push('/')
    },
    validateStepOne: function() {
      this.stepOneComplete = this.$refs.formOne.validate()
      if (this.stepOneComplete && this.stepIndex == 1) {
        this.stepIndex = 2
      }
    },
    onNewComp: async function() {
      const uid = localStorage.currentUser
      this.saving = true
      let compRef = null
      do {
        compRef = uuidv4().substring(0, 8)
        const result = await firestore
          .collection('comps')
          .where('compMgrs', 'array-contains', uid)
          .where('comp_ref', '==', compRef)
          .get()

        if (!result.empty) {
          compRef = null
        }
      } while (compRef == null)

      await firestore.collection('comps').add({
        name: this.compName,
        comp_ref: compRef,
        federation: 'IPF',
        compMgrs: [uid],
        description: null,
        compinfo_url: null,
        livestream_url: null,
        timezone: moment.tz.guess(),
        startdate: this.compStartDate,
        weighin_start: null,
        lifting_start: null,
        plates: {
          barbell_weight: 20,
          plates25kg: 0,
          plates20kg: 0,
          plates15kg: 0,
          plates10kg: 0,
          plates5kg: 0,
          plates2d5kg: 0,
          plates1d25kg: 0,
          plates0d5kg: 0,
          plates0d25kg: 0
        },
        venue: {
          name: null,
          street_number: null,
          street_name: null,
          city: null,
          province_state: null,
          postal_code: null,
          country: null,
          notes: null
        }
      })

      const snapshot = await firestore
        .collection('federations')
        .orderBy('name')
        .get()

      spotterDb.federations.clear()
      snapshot.forEach(doc => {
        spotterDb.federations.put(doc.data())
      })

      this.saving = false
      this.$router.push(`/${compRef}/`)
    }
  }
}
</script>
