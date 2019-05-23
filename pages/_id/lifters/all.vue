<template>
  <div
    v-if="loading"
    class="text-xs-center">
    <v-progress-circular
      :size="100"
      indeterminate
      color="primary"
      class="mt-5"
    />
  </div>
  <div v-else>
    <locked-comp :show="isCompLocked" />
    <v-card class="ma-4">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        />
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-shortkey.once="['ctrl', 'alt', 'a']"
              color="info"
              v-on="on"
              @click="addLifter()"
              @shortkey="addLifter()">
              Add Lifter
            </v-btn>
          </template>
          <span>CTRL + ALT + A</span>
        </v-tooltip>
      </v-card-title>

      <v-data-table
        :headers="lifterHeaders"
        :items="lifters"
        :search="search"
        :rows-per-page-items="rowPerPageItems"
        :rows-per-page-text="rowsPerPageText"
      >
        <template
          slot="items"
          slot-scope="props">
          <td class="text-xs-center">
            <v-btn
              icon
              aria-label="Edit lifter"
              class="mx-0"
              @click="browseToLifter(props.item)">
              <v-icon color="amber">edit</v-icon>
            </v-btn>
          </td>
          <td class="text-xs-left">{{ props.item.first_name }}</td>
          <td class="text-xs-left">{{ props.item.last_name }}</td>
          <td class="text-xs-left">{{ props.item.gender }}</td>
          <td class="text-xs-right">{{ props.item.dob }}</td>
          <td class="text-xs-left">{{ props.item.division_name }}</td>
          <td class="text-xs-left">{{ props.item.weight_class }}</td>
          <td
            v-if="!isCompLocked"
            class="text-xs-center">
            <v-btn
              icon
              class="mx-0"
              aria-label="Delete lifter"
              @click="showDeleteLifter(props.item)">
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </template>
        
        <template slot="no-data">
          There are no lifters to display
        </template>

        <template slot="no-results">
          <v-alert
            :value="true"
            color="error"
            icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>
    
    <v-layout
      row
      justify-center>
      <v-dialog
        v-model="showAddLifter"
        persistent
        max-width="500px">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation>
                <v-layout wrap>
                  <span class="headline">Add Lifter</span>
                  <v-flex xs12>
                    <v-text-field
                      ref="lifterFirstNameTxt"
                      v-model="lifterFirstName"
                      :rules="[v => !!v || 'First Name is required']"
                      label="First Name"
                      required
                    />
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      v-model="lifterLastName"
                      :rules="[v => !!v || 'Last Name is required']"
                      label="Last Name"
                      required
                    />
                  </v-flex>

                  <v-flex 
                    xs12
                    sm6>
                    <v-select
                      v-model="lifterSelectedGender"
                      :items="lifterGenders"
                      :rules="[v => !!v || 'Gender is required']"
                      item-text="gender"
                      label="Gender"
                      required
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    sm6>
                    <v-dialog
                      ref="modalDobDialog"
                      v-model="modalDob"
                      :return-value.sync="lifterDob"
                      persistent
                      lazy
                      full-width
                      width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="lifterDob"
                        :rules="[v => !!v || 'Date of Birth is required']"
                        label="Date of Birth"
                        required
                        readonly
                      />
                      <v-date-picker
                        v-model="lifterDob"
                        :max="maxDate"
                        scrollable>
                        <v-spacer />
                        <v-btn
                          flat
                          color="primary"
                          @click="modalDob = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          flat
                          color="primary"
                          @click="saveDob">
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="saveWaiting"
              color="blue darken-1"
              dark
              @click.native="saveNewLifter()">
              Save
            </v-btn>
            <v-btn
              :disabled="saveWaiting"
              color="blue darken-1"
              flat
              @click.native="showAddLifter = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-dialog
      v-model="showDeleteDialog"
      max-width="340"
    >
      <v-card>
        <v-card-title class="headline">Delete Lifter?</v-card-title>
        <v-card-text>
          <div>Are you sure you want to delete</div>
          <div class="body-2">{{ lifterToDeleteName }}</div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="deleting"
            :loading="deleting"
            flat
            color="error"
            @click="deleteLifter"
          >
            Confirm
          </v-btn>
          <v-btn
            :disabled="deleting"
            flat
            @click="showDeleteDialog = false"
          >
            cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import LockedComp from '~/components/lockedcomp/lockedcomp'
import moment from 'moment'
import { firestore } from '~/services/fireinit.js'
import { spotterDb } from '~/services/dexieinit'
import uuidv4 from 'uuid/v4'
import * as firebase from 'firebase/app'

export default {
  components: {
    LockedComp
  },

  data: () => ({
    loading: false,
    isCompLocked: false,
    rowPerPageItems: [10, 25, 50, { text: 'All', value: -1 }],
    rowsPerPageText: 'Lifters per page: ',
    search: null,
    showAddLifter: false,
    showDeleteDialog: false,
    saveWaiting: false,
    lifterFirstName: null,
    lifterLastName: null,
    lifterGenders: ['Male', 'Female'],
    lifterSelectedGender: null,
    modalDob: null,
    lifterDob: null,
    valid: false,
    lifterToDelete: null,
    deleting: false,
    maxDate: undefined,
    headers: [
      {
        text: '',
        value: 'action',
        sortable: false
      },
      {
        text: 'First Name',
        align: 'left',
        value: 'first_name'
      },
      {
        text: 'Last Name',
        align: 'left',
        value: 'last_name'
      },
      {
        text: 'Gender',
        align: 'left',
        value: 'gender'
      },
      {
        text: 'Date of Birth',
        align: 'left',
        value: 'dob'
      },
      {
        text: 'Division',
        align: 'left',
        value: 'division_name'
      },
      {
        text: 'Weight Class',
        align: 'left',
        value: 'weight_class'
      },
      {
        text: '',
        value: 'action',
        sortable: false
      }
    ],
    items: [],
    lifters: []
  }),

  computed: {
    lifterToDeleteName: function() {
      if (!this.lifterToDelete) return null
      return `
        ${this.lifterToDelete.first_name} ${this.lifterToDelete.last_name}
      `
    },
    lifterHeaders: function() {
      let newHeaders = []
      for (let index = 0; index < this.headers.length; index++) {
        if (this.isCompLocked && index === this.headers.length - 1) {
          // Don't bother including the delete if column if we're in lock mode
          break
        } else {
          newHeaders.push(this.headers[index])
        }
      }
      return newHeaders
    }
  },

  async created() {
    // Figure out what the max date would be for a lifter. Used by Add Lifter
    this.loading = true
    const result = await spotterDb.comps
      .where('comp_ref')
      .equals(this.$route.params.id)
      .toArray()
    if (result.length != 1) return

    const comp = result[0]
    this.isCompLocked = comp.locked

    const fed = await spotterDb.federations
      .where('name')
      .equals(comp.federation.toUpperCase())
      .first()

    const lowestYears = fed.divisions.reduce((prev, curr) => {
      if (prev.startAge == curr.startAge) {
        // Possible case where, say, Open and Juniors have the same start date then
        // select the non-open category
        return prev.endAge < curr.endAge ? prev : curr
      }

      return prev.startAge < curr.startAge ? prev : curr
    })
    this.maxDate = moment()
      .subtract(lowestYears.startAge, 'year')
      .toISOString()

    // // Store all the LIFTERS in IndexedDb
    // const lifters = await firestore
    //   .collection('comps')
    //   .doc(comp.id)
    //   .collection('lifters')
    //   .get()

    // await spotterDb.lifters
    //   .where('compid')
    //   .equals(comp.id)
    //   .delete()

    // this.lifters.length = 0
    // lifters.forEach(async doc => {
    //   let lifter = doc.data()
    //   lifter.id = doc.id
    //   await spotterDb.lifters.put(lifter)
    // })

    // Get the actual lifters
    this.lifters = await spotterDb.lifters
      .where('comp_ref')
      .equals(this.$route.params.id)
      .toArray()

    // Temporary code
    // this.lifters.forEach(lifter => {
    //   console.log(lifter)
    //   firestore
    //     .collection('comps')
    //     .doc(comp.id)
    //     .collection('lifters')
    //     .doc(lifter.id)
    //     .update({
    //       lifts: {
    //         bench1: {
    //           good_lift: null,
    //           record_attempt: false
    //         },
    //         bench2: {
    //           good_lift: null,
    //           record_attempt: false
    //         },
    //         bench3: {
    //           good_lift: null,
    //           record_attempt: false
    //         },
    //         squat1: {
    //           good_lift: null,
    //           record_attempt: false
    //         },
    //         squat2: {
    //           good_lift: null,
    //           record_attempt: false
    //         },
    //         squat3: {
    //           good_lift: null,
    //           record_attempt: false
    //         },
    //         deadlift1: {
    //           good_lift: null,
    //           record_attempt: false
    //         },
    //         deadlift2: {
    //           good_lift: null,
    //           record_attempt: false
    //         },
    //         deadlift3: {
    //           good_lift: null,
    //           record_attempt: false
    //         }
    //       }
    //       // opening_squat: firebase.firestore.FieldValue.delete(),
    //       // opening_bench: firebase.firestore.FieldValue.delete(),
    //       // opening_deadlift: firebase.firestore.FieldValue.delete()
    //     })
    // })

    this.loading = false
  },

  methods: {
    saveDob: function() {
      this.$refs.modalDobDialog.save(this.lifterDob)
    },
    addLifter() {
      this.lifterFirstName = null
      this.lifterLastName = null
      this.lifterSelectedGender = null
      this.lifterDob = null
      this.$refs.form.reset()
      this.$nextTick(this.$refs.lifterFirstNameTxt.focus)
      this.showAddLifter = true
    },
    async saveNewLifter() {
      if (this.$refs.form.validate()) {
        const result = await spotterDb.comps
          .where('comp_ref')
          .equals(this.$route.params.id)
          .toArray()
        if (result.length != 1) return

        const compId = result[0].id

        if (compId) {
          this.saveWaiting = true
          let lifterRef = null
          do {
            lifterRef = uuidv4().substring(0, 8)
            const result = await firestore
              .collection('comps')
              .doc(compId)
              .collection('lifters')
              .where('lifter_ref', '==', lifterRef)
              .get()

            if (!result.empty) {
              lifterRef = null
            }
          } while (lifterRef == null)

          const lifter = {
            compid: compId,
            comp_ref: this.$route.params.id,
            first_name: this.lifterFirstName,
            last_name: this.lifterLastName,
            gender: this.lifterSelectedGender,
            dob: this.lifterDob,
            lifter_ref: lifterRef,
            division_name: null,
            body_weight: null,
            weight_class: null,
            division_name: null,
            raw_equipped: null,
            paid: false,
            lot_number: null,
            lifts: {
              squat1: {
                goodlift: null,
                weight: -1
              },
              bench1: {
                goodlift: null,
                weight: -1
              },
              deadlift1: {
                goodlift: null,
                weight: -1
              }
            },
            squat_rack_position: null,
            squat_height: null,
            bench_height: null,
            bench_safety_height: null,
            email_address: null,
            mobile_number: null,
            nominated_division_name: null,
            nominated_weight_class: null,
            pb_squat: null,
            pb_bench: null,
            pb_deadlift: null,
            pb_total: null,
            notes: null
          }

          const newLifter = await firestore
            .collection('comps')
            .doc(compId)
            .collection('lifters')
            .add(lifter)

          lifter.id = newLifter.id
          lifter.comp_ref = this.$route.params.id
          lifter.compid = compId

          spotterDb.lifters.put(lifter)
          this.lifters = await spotterDb.lifters
            .where('comp_ref')
            .equals(this.$route.params.id)
            .toArray()
          this.saveWaiting = false

          // Now browse to the lifter's page
          this.$router.push(`/${this.$route.params.id}/lifters/${lifterRef}`)
        }
      }
    },
    browseToLifter(lifter) {
      this.$router.push(
        `/${this.$route.params.id}/lifters/${lifter.lifter_ref}`
      )
    },
    showDeleteLifter(lifter) {
      this.lifterToDelete = lifter
      this.showDeleteDialog = true
    },
    async deleteLifter() {
      const result = await spotterDb.comps
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()
      if (result.length != 1) return
      this.deleting = true

      const compId = result[0].id

      const lifterIndex = this.lifters.findIndex(
        x => x.lifter_ref == this.lifterToDelete.lifter_ref
      )
      this.lifters.splice(lifterIndex, 1)

      await firestore
        .collection('comps')
        .doc(compId)
        .collection('lifters')
        .doc(this.lifterToDelete.id)
        .delete()

      await spotterDb.lifters
        .where('lifter_ref')
        .equals(this.lifterToDelete.lifter_ref)
        .delete()

      this.deleting = false
      this.showDeleteDialog = false
      this.lifterToDelete = null
    }
  }
}
</script>
