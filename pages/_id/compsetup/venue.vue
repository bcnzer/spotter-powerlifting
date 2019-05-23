<template>
  <v-form
    ref="form"
    lazy-validation>
    <v-container
      grid-list-md>
      <locked-comp :show="isCompLocked" />
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="venueName"
            label="Venue Name"
          />
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs3>
          <v-text-field
            v-model="venueStreetNumber"
            label="Street Number"
          />
        </v-flex>

        <v-flex xs9>
          <v-text-field
            v-model="venueStreetName"
            label="Street Name"
          />
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex
          xs12
          sm5>
          <v-text-field
            v-model="venueCity"
            label="City"
          />
        </v-flex>

        <v-flex
          xs12
          sm7>
          <v-text-field
            v-model="venueProvinceState"
            label="Province / State"
          />
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex
          xs12
          sm5>
          <v-text-field
            v-model="venuePostalCode"
            label="Postal Code"
          />
        </v-flex>

        <v-flex
          xs12
          sm7>
          <v-text-field
            v-model="venueCountry"
            label="Country"
          />
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex
          xs12>
          <v-textarea
            v-model="venueNotes"
            label="Notes"
          />
        </v-flex>
      </v-layout>

      <v-btn
        :disabled="saving || isCompLocked"
        :loading="saving"
        class="info"
        @click="submit"
      >
        save
      </v-btn>
    </v-container>
  </v-form>
</template>
        
<script>
import { CurrentComp } from '~/utils/indexedDbHelpers'
import LockedComp from '~/components/lockedcomp/lockedcomp'
import { firestore } from '~/services/fireinit.js'
import { spotterDb } from '~/services/dexieinit'

export default {
  components: {
    LockedComp
  },

  data: () => ({
    isCompLocked: false,
    venueName: null,
    venueStreetNumber: null,
    venueStreetName: null,
    venueCity: null,
    venueProvinceState: null,
    venuePostalCode: null,
    venueCountry: null,
    venueNotes: null,
    saving: false
  }),

  mounted: async function() {
    const comp = await CurrentComp(this.$route.params.id)
    this.isCompLocked = comp.locked

    this.venueName = comp.venue.name
    this.venueStreetNumber = comp.venue.street_number
    this.venueStreetName = comp.venue.street_name
    this.venueCity = comp.venue.city
    this.venueProvinceState = comp.venue.province_state
    this.venuePostalCode = comp.venue.postal_code
    this.venueCountry = comp.venue.country
    this.venueNotes = comp.venue.notes
  },

  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.saving = true
        const result = await spotterDb.comps
          .where('comp_ref')
          .equals(this.$route.params.id)
          .toArray()
        if (result.length != 1) return

        const compId = result[0].id

        if (compId) {
          const compVenue = {
            venue: {
              name: this.venueName,
              street_number: this.venueStreetNumber,
              street_name: this.venueStreetName,
              city: this.venueCity,
              province_state: this.venueProvinceState,
              postal_code: this.venuePostalCode,
              country: this.venueCountry,
              notes: this.venueNotes
            }
          }

          let compRef = firestore.collection('comps').doc(compId)
          await compRef.update(compVenue)

          await spotterDb.comps.update(compId, compVenue)

          this.$store.commit('snackbar/setSnack', 'Venue saved')
        }
        this.saving = false
      }
    }
  }
}
</script>
