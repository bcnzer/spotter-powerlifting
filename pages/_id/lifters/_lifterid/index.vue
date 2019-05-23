<template>
  <v-form
    ref="form"
    v-model="valid"
    :disabled="isCompLocked"
    lazy-validation>
    <locked-comp :show="isCompLocked" />

    <v-container
      grid-list-md>

      <!-- 1st row -->
      <v-layout
        row
        wrap>
        <v-flex
          xs12
          sm5>
          <v-text-field
            v-model="lifterFirstName"
            label="First Name"
            required
          />
        </v-flex>

        <v-flex
          xs12
          sm5>
          <v-text-field
            v-model="lifterLastName"
            label="Last Name"
            required
          />
        </v-flex>

        <v-flex 
          xs12
          sm2>
          <v-select
            v-model="lifterSelectedGender"
            :items="lifterGenders"
            :rules="[v => (v !== null) || 'Gender is required']"
            item-text="gender"
            label="Gender"
            required
            @change="updateDivisionAndWeightClass"
          />
        </v-flex>
      </v-layout>
      
      <!-- 2nd row -->
      <v-layout
        row
        wrap>
        <v-flex
          xs12
          sm3>
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

        <v-flex
          xs12
          sm3>
          <v-select
            v-if="!loadingDivisions"
            v-model="lifterSelectedDivision"
            :items="lifterDivisions"
            :rules="[v => !!v || 'Division is required']"
            item-text="name"
            item-value="abbreviation"
            label="Division"
            required
          />
      
          <p
            v-if="loadingDivisions"
            class="text-xs-center">
            <v-progress-circular 
              indeterminate 
              color="amber" />
          </p>
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-text-field
            v-model="lifterBodyWeight"
            :rules="[v => !!v || 'Body weight is required']"
            label="Body Weight"
            required
            @change="determineWeightClass"
            @paste="determineWeightClass" />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-select
            v-if="!loadingWeightClasses"
            v-model="lifterSelectedWeightClass"
            :items="lifterWeightClasses"
            :rules="[v => !!v || 'Weight Class is required']"
            item-text="name"
            item-value="name"
            label="Weight Class"
            required />
      
          <p
            v-if="loadingWeightClasses"
            class="text-xs-center">
            <v-progress-circular 
              indeterminate 
              color="amber" />
          </p>
        </v-flex>
      </v-layout>

      <!-- 3rd row -->
      <v-layout
        row
        wrap>
        <v-flex
          xs12
          sm3>
          <v-select
            v-model="lifterSelectedRawEquipped"
            :items="lifterRawEquipped"
            :rules="[v => (v !== null) || 'Raw or Equipped is required']"
            label="Raw or Equipped"
            required />
        </v-flex>

        <v-flex
          xs12
          sm4>
          <v-select
            v-model="lifterSelectedTeam"
            :items="lifterTeams"
            item-text="abbreviation"
            item-value="teamId"
            label="Team" />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-checkbox
            v-model="lifterCompFeePaid"
            label="Comp Fee Paid" />
        </v-flex>

        <v-flex
          xs12
          sm2>
          <v-text-field
            v-model="lifterLotNumber"
            label="Lot Number" />
        </v-flex>
      </v-layout>
      
      <!-- 4th row -->
      <v-layout
        row
        wrap>
        <v-flex
          xs12
          sm3>
          <v-text-field
            v-if="compHasLiftSquat"
            v-model="lifterOpeningSquat"
            label="Opening Squat" />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-text-field
            v-if="compHasLiftBench"
            v-model="lifterOpeningBench"
            label="Opening Bench" />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-text-field
            v-if="compHasLiftDeadlift"
            v-model="lifterOpeningDeadlift"
            label="Opening Deadlift" />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-select
            v-model="lifterSelectedRackPositions"
            :items="lifterRackPositions"
            label="Squat Rack Position" />
        </v-flex>
      </v-layout>

      <!-- 5th row -->
      <v-layout
        row
        wrap>
        <v-flex
          xs12
          sm3>
          <v-text-field
            v-model="lifterSquatHeight"
            label="Squat Height" />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-text-field
            v-model="lifterBenchHeight"
            label="Bench Height" />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-text-field
            v-model="lifterBenchSafetyHeight" 
            label="Bench Safety Height"/>
        </v-flex>
      </v-layout>

      <!-- 6th row -->
      <v-layout
        row
        wrap>
        <v-flex
          xs12
          sm4>
          <v-text-field
            v-model="lifterEmailAddress"
            label="Email Address"
            required />
        </v-flex>

        <v-flex
          xs12
          sm2>
          <v-text-field
            v-model="lifterMobileNumber"
            label="Mobile Number"
          />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-text-field
            v-model="lifterNominatedDivision"
            label="Nominated Division"
            disabled
          />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-text-field
            v-model="lifterNominatedWeightClass"
            label="Nominated Weight Class"
            disabled />
        </v-flex>
      </v-layout>

      <!-- 7th row -->
      <v-layout
        row
        wrap>
        <v-flex
          xs12
          sm3>
          <v-text-field
            v-model="lifterPbSquat"
            label="Personal Best - Squat" />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-text-field
            v-model="lifterPbBench"
            label="Personal Best - Bench" />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-text-field
            v-model="lifterPbDeadlift"
            label="Personal Best - Deadlift" />
        </v-flex>

        <v-flex
          xs12
          sm3>
          <v-text-field
            v-model="lifterPbTotal"
            label="Personal Best - Total" />
        </v-flex>
      </v-layout>

      <!-- 8th row -->
      <v-layout row>
        <v-flex xs12>
          <v-textarea
            v-model="lifterNotes"
            label="Lifter Notes"
          />
        </v-flex>
      </v-layout>
      
      <!-- Save and delete button row -->
      <v-layout row>
        <v-flex xs12>
          <v-btn
            :disabled="!valid || saving || isCompLocked"
            :loading="saving"
            class="info"
            @click="submit"
          >
            save
          </v-btn>
          <v-spacer />
          <v-btn
            :disabled="!valid || saving"
            :loading="saving"
            class="success"
            @click="nextLifter"
          >
            next lifter
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>


<script>
import LockedComp from '~/components/lockedcomp/lockedcomp'
import moment from 'moment'
import { spotterDb } from '~/services/dexieinit'
import { firestore } from '~/services/fireinit.js'
import { mapMutations } from 'vuex'

export default {
  components: {
    LockedComp
  },

  data: () => ({
    compId: null,
    loading: true,
    valid: false,
    saving: false,
    isCompLocked: false,

    lifterId: null,
    lifterFirstName: null,
    lifterLastName: null,
    lifterGenders: ['Male', 'Female'],
    lifterSelectedGender: null,

    modalDob: null,
    lifterDob: null,
    lifterDivisions: [
      {
        name: '',
        abbreviation: null
      }
    ],
    loadingDivisions: false,
    lifterSelectedDivision: null,
    lifterBodyWeight: null,

    compHasLiftSquat: true,
    compHasLiftBench: true,
    compHasLiftDeadlift: true,

    lifterWeightClasses: [
      {
        name: ''
      }
    ],
    lifterSelectedWeightClass: null,
    loadingWeightClasses: false,

    lifterRawEquipped: ['Raw', 'Equipped'],
    lifterSelectedRawEquipped: null,

    lifterTeams: [
      {
        abbreviation: '',
        teamId: 0
      }
    ],
    lifterSelectedTeam: null,

    lifterCompFeePaid: false,
    lifterLotNumber: null,

    lifterOpeningSquat: null,
    lifterOpeningBench: null,
    lifterOpeningDeadlift: null,
    lifterRackPositions: [
      'Not specified',
      'In',
      'Out',
      'Left In / Right Out',
      'Left Out / Right In'
    ],
    lifterSelectedRackPositions: 0,

    lifterSquatHeight: null,
    lifterBenchHeight: null,
    lifterBenchSafetyHeight: null,
    lifterBlocks: [
      {
        blockHeight: '',
        blockId: 0
      }
    ],
    lifterSelectedBlock: null,

    lifterEmailAddress: null,
    lifterMobileNumber: null,
    lifterNominatedDivision: null,
    lifterNominatedWeightClass: null,

    lifterPbSquat: null,
    lifterPbBench: null,
    lifterPbDeadlift: null,
    lifterPbTotal: null,

    lifterNotes: null
  }),

  async created() {
    // Get the comp so we can determine if it's locked
    const result = await spotterDb.comps
      .where('comp_ref')
      .equals(this.$route.params.id)
      .toArray()
    if (result.length != 1) return

    const comp = result[0]
    this.isCompLocked = comp.locked

    // Get all the current lifters
    this.lifterTeams = await spotterDb.teams
      .where('comp_ref')
      .equals(this.$route.params.id)
      .toArray()

    const lifters = await spotterDb.lifters
      .where('lifter_ref')
      .equals(this.$route.params.lifterid)
      .toArray()

    if (lifters.length !== 1) {
      this.$router.push(`/${this.$route.params.id}/lifters/all`)
    }

    // Load the lifter
    const lifter = lifters[0]

    this.lifterId = lifter.id
    this.compId = lifter.compid
    this.lifterFirstName = lifter.first_name
    this.lifterLastName = lifter.last_name
    this.lifterSelectedGender = lifter.gender
    this.lifterDob = lifter.dob
    this.lifterBodyWeight = lifter.body_weight
    if (lifter.weight_class) {
      this.lifterWeightClasses.pop()
      this.lifterWeightClasses.push(lifter.weight_class)
      this.lifterSelectedWeightClass = lifter.weight_class
    }
    if (lifter.division_name) {
      this.lifterDivisions.pop()
      this.lifterDivisions.push(lifter.division_name)
      this.lifterSelectedDivision = lifter.division_name
    } else {
      this.determineDivision()
    }
    if (lifter.team) {
      this.lifterSelectedTeam = lifter.team
    }
    this.lifterSelectedRawEquipped = lifter.raw_equipped
    this.lifterCompFeePaid = lifter.paid
    this.lifterLotNumber = lifter.lot_number
    this.lifterOpeningSquat =
      lifter.lifts.squat1.weight >= 0 ? lifter.lifts.squat1.weight : null
    this.lifterOpeningBench =
      lifter.lifts.bench1.weight >= 0 ? lifter.lifts.bench1.weight : null
    this.lifterOpeningDeadlift =
      lifter.lifts.deadlift1.weight >= 0 ? lifter.lifts.deadlift1.weight : null
    this.lifterSelectedRackPositions = lifter.squat_rack_position
    this.lifterSquatHeight = lifter.squat_height
    this.lifterBenchHeight = lifter.bench_height
    this.lifterBenchSafetyHeight = lifter.bench_safety_height
    this.lifterEmailAddress = lifter.email_address
    this.lifterMobileNumber = lifter.mobile_number
    this.lifterNominatedDivision = lifter.nominated_division_name
    this.lifterNominatedWeightClass = lifter.nominated_weight_class
    this.lifterPbSquat = lifter.pb_squat
    this.lifterPbBench = lifter.pb_bench
    this.lifterPbDeadlift = lifter.pb_deadlift
    this.lifterPbTotal = lifter.pb_total
    this.lifterNotes = lifter.notes
  },

  methods: {
    nextLifter: async function() {
      const lifters = await spotterDb.lifters
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()

      for (let index = 0; index < lifters.length; index++) {
        if (lifters[index].id === this.lifterId) {
          if (index + 1 === lifters.length) {
            this.$router.push(
              `/${this.$route.params.id}/lifters/${lifters[0].lifter_ref}`
            )
          } else {
            this.$router.push(
              `/${this.$route.params.id}/lifters/${
                lifters[index + 1].lifter_ref
              }`
            )
          }
        }
      }
    },
    submit: async function() {
      if (this.$refs.form.validate()) {
        this.saving = true

        var lifter = {
          first_name: this.lifterFirstName,
          last_name: this.lifterLastName,
          gender: this.lifterSelectedGender,
          dob: this.lifterDob,
          body_weight: this.lifterBodyWeight,
          weight_class: this.lifterSelectedWeightClass,
          division_name: this.lifterSelectedDivision,
          raw_equipped: !this.lifterSelectedRawEquipped
            ? null
            : this.lifterSelectedRawEquipped,
          team: this.lifterSelectedTeam,
          paid: this.lifterCompFeePaid,
          lot_number: this.lifterLotNumber,
          lifts: {
            squat1: {
              goodlift: null,
              weight: !this.lifterOpeningSquat
                ? -1
                : Number(this.lifterOpeningSquat)
            },
            bench1: {
              goodlift: null,
              weight: !this.lifterOpeningBench
                ? -1
                : Number(this.lifterOpeningBench)
            },
            deadlift1: {
              goodlift: null,
              weight: !this.lifterOpeningDeadlift
                ? -1
                : Number(this.lifterOpeningDeadlift)
            }
          },
          squat_rack_position: this.lifterSelectedRackPositions,
          squat_height: this.lifterSquatHeight,
          bench_height: this.lifterBenchHeight,
          bench_safety_height: this.lifterBenchSafetyHeight,
          email_address: this.lifterEmailAddress,
          mobile_number: this.lifterMobileNumber,
          nominated_division_name: this.lifterNominatedDivision,
          nominated_weight_class: this.lifterNominatedWeightClass,
          pb_squat: this.lifterPbSquat,
          pb_bench: this.lifterPbBench,
          pb_deadlift: this.lifterPbDeadlift,
          pb_total: this.lifterPbTotal,
          notes: this.lifterNotes
        }

        spotterDb.lifters.update(this.lifterId, lifter)

        firestore
          .collection('comps')
          .doc(this.compId)
          .collection('lifters')
          .doc(this.lifterId)
          .update(lifter)

        this.saving = false
        this.$store.commit('snackbar/setSnack', 'Lifter saved')
      }
    },

    saveDob: function() {
      this.$refs.modalDobDialog.save(this.lifterDob)
      this.determineDivision()
    },

    updateDivisionAndWeightClass: async function() {
      await this.determineDivision()
      await this.determineWeightClass()
    },

    federationRuleset: async function() {
      const result = await spotterDb.comps
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()
      if (result.length != 1) return

      const comp = result[0]

      const fed = await spotterDb.federations
        .where('name')
        .equals(comp.federation.toUpperCase())
        .first()
      return fed
    },

    determineDivision: async function() {
      if (this.lifterDob !== null) {
        this.loadingDivisions = true

        const today = new Date()
        const ageYears = today.getFullYear() - moment(this.lifterDob).year()
        const fed = await this.federationRuleset()
        this.lifterDivisions = fed.divisions.filter(
          div => ageYears >= div.startAge && ageYears <= div.endAge
        )
        if (this.lifterDivisions.length == 0) {
          this.lifterDivisions = [
            {
              name: '',
              abbreviation: null
            }
          ]
        } else if (this.lifterDivisions.length === 1) {
          this.lifterSelectedDivision = this.lifterDivisions[0].name
        } else {
          this.lifterSelectedDivision = null
        }

        this.loadingDivisions = false
      }
    },

    determineWeightClass: async function() {
      if (
        this.lifterSelectedGender !== null &&
        this.lifterBodyWeight !== null &&
        this.lifterBodyWeight !== ''
      ) {
        this.loadingWeightClasses = true
        this.lifterSelectedWeightClass = null
        const isMale = this.lifterSelectedGender == 'Male'

        const fed = await this.federationRuleset()
        const weightClasses = fed.weightClasses.filter(
          wc =>
            wc.male == isMale &&
            this.lifterBodyWeight >= wc.startWeight &&
            this.lifterBodyWeight <= wc.endWeight
        )
        this.lifterWeightClasses = weightClasses
        if (weightClasses.length === 1) {
          this.lifterSelectedWeightClass = this.lifterWeightClasses[0].name
        }
        this.loadingWeightClasses = false
      } else {
        this.lifterWeightClasses = [
          {
            name: ''
          }
        ]
        this.lifterSelectedRawEquipped = null
      }
    }
  }
}
</script>
