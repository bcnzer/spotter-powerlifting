<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-slide-y-transition mode="out-in">
      <v-container
        grid-list-md>
        <locked-comp :show="isCompLocked" />
        
        <v-layout row>
          <v-flex xs12>
            <v-text-field
              v-model="compName"
              :rules="[v => !!v || 'Competition Name is required']"
              label="Competition Name"
              required />
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12>
            <v-textarea
              v-model="compDescription"
              label="Competition Description"
              hint="A detailed description of the comp which we will use online for people signing up to the comp" />
          </v-flex>
        </v-layout>

        <v-layout
          row
          wrap>
          <v-flex
            xs12
            md6>
            <v-text-field
              v-model="urlCompInfo"
              :rules="urlRules"
              label="Competition URL"
              persistent-hint />
          </v-flex>

          <v-flex
            xs12
            md6>
            <v-text-field
              v-model="urlLivestream"
              :rules="urlRules"
              label="Livestream URL" />
          </v-flex>
        </v-layout>

        <v-layout
          row
          wrap>
          <v-flex
            xs12
            sm6
            md3>
            <v-autocomplete
              v-model="compTimeZone"
              :rules="[v => !!v || 'Time Zone is required']"
              :items="tzList"
              label="Time Zone"
              prepend-icon="language"
            />
          </v-flex>

          <v-flex
            xs12
            sm6
            md3>
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
          </v-flex>
          
          <v-flex
            xs12
            sm6
            md3>
            <time-picker
              :time="compWeighInTime"
              text-label="Weigh-in Time"
              @time-saved="onWeighInTimeSelected" />
          </v-flex>
          
          <v-flex
            xs12
            sm6
            md3>
            <time-picker
              :time="compLiftingStartTime"
              text-label="Lifting Start Time"
              @time-saved="onLiftingStartTimeSelected" />
          </v-flex>
        </v-layout>

        <v-btn
          :disabled="!valid || saving || isCompLocked"
          :loading="saving"
          class="info"
          @click="submit">
          save
        </v-btn>
      </v-container>
    </v-slide-y-transition>
  </v-form>
</template>

<script>
import { CurrentComp } from '~/utils/indexedDbHelpers'
import LockedComp from '~/components/lockedcomp/lockedcomp'
import moment from 'moment-timezone'
import TimePicker from '~/components/compsetup/details/timepicker'
import { firestore } from '~/services/fireinit.js'
import { spotterDb } from '~/services/dexieinit'

export default {
  components: {
    LockedComp,
    TimePicker
  },

  data: () => ({
    isCompLocked: false,
    valid: true,
    loading: true,
    saving: false,
    compName: null,
    compDescription: null,
    urlCompInfo: null,
    urlLivestream: null,
    compTimeZone: moment.tz.guess(),
    compStartDate: null,
    compWeighInTime: null,
    compLiftingStartTime: null,
    timeZone: null,
    tzList: moment.tz.names(),
    modalStartDate: false,
    modalWeighIn: false,
    modalLiftingStart: false,
    urlRules: [
      v => {
        if (
          v &&
          /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
            v
          ) === false
        ) {
          return 'URL must be valid'
        } else {
          return true
        }
      }
    ]
  }),

  async created() {
    const comp = await CurrentComp(this.$route.params.id)
    this.isCompLocked = comp.locked

    this.compName = comp.name
    this.compDescription = comp.description
    this.urlCompInfo = comp.compinfo_url
    this.urlLivestream = comp.livestream_url
    this.compTimeZone = comp.timezone || moment.tz.guess()
    this.compStartDate = comp.startdate
    this.compWeighInTime = comp.weighin_start
    this.compLiftingStartTime = comp.lifting_start
  },

  methods: {
    onWeighInTimeSelected: function(dialogTime) {
      this.compWeighInTime = dialogTime
    },
    onLiftingStartTimeSelected: function(dialogTime) {
      this.compLiftingStartTime = dialogTime
    },
    onOnlineEntriesCloseDateSelect: function(dialogTime) {
      this.onlineEntriesOpenTime = dialogTime
    },
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
          const compDetails = {
            name: this.compName,
            description: this.compDescription,
            compinfo_url: this.urlCompInfo,
            livestream_url: this.urlLivestream,
            timezone: this.compTimeZone,
            startdate: this.compStartDate,
            weighin_start: this.compWeighInTime,
            lifting_start: this.compLiftingStartTime
          }

          let compRef = firestore.collection('comps').doc(compId)
          await compRef.update(compDetails)

          spotterDb.comps.update(compId, compDetails)

          this.$store.commit('snackbar/setSnack', 'Comp Details saved')
        }
        this.saving = false
      }
    }
  }
}
</script>
