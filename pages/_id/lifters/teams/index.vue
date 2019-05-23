<template>
  <div>
    <v-container grid-list-sm>
      <locked-comp :show="isCompLocked" />

      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          />
          <v-spacer />
          <v-btn
            :disabled="isCompLocked"
            color="info"
            @click="addTeam()">
            Add Team
          </v-btn>
        </v-card-title>

        <v-data-table
          :headers="teamHeaders"
          :items="teams"
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
                class="mx-0"
                aria-label="Edit team"
                @click="editTeam(props.item)">
                <v-icon color="amber">edit</v-icon>
              </v-btn>
            </td>
            <td class="text-xs-left">{{ props.item.abbreviation }}</td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td
              v-if="!isCompLocked"
              class="text-xs-center">
              <v-btn
                icon
                class="mx-0"
                aria-label="Delete team"
                @click="showDeleteTeam(props.item)">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </template>
          
          <template slot="no-data">
            There are no teams to display
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
    </v-container>
    
    <v-layout
      row
      justify-center>
      <v-dialog
        v-model="showTeamDialog"
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
                  <span class="headline">{{ dialogTitle }}</span>
                  <v-flex xs12>
                    <v-text-field
                      v-model="teamAbbreviation"
                      :readonly="isCompLocked"
                      :rules="[v => !!v || 'Abbreviation Name is required']"
                      label="Abbreviation"
                      required
                    />
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      v-model="teamName"
                      :readonly="isCompLocked"
                      :rules="[v => !!v || 'Name is required']"
                      label="Name"
                      required
                    />
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="isCompLocked"
              :loading="saveWaiting"
              color="blue darken-1"
              dark
              @click.native="saveTeam()">
              Save
            </v-btn>
            <v-btn
              :disabled="saveWaiting"
              color="blue darken-1"
              flat
              @click.native="showTeamDialog = false">
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
        <v-card-title class="headline">Delete Team?</v-card-title>
        <v-card-text>
          <div>Are you sure you want to delete <b>{{ teamToDeleteName }}</b>?</div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="deleting"
            :loading="deleting"
            flat
            color="error"
            @click="deleteTeam"
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
import { CurrentComp } from '~/utils/indexedDbHelpers'
import { firestore } from '~/services/fireinit.js'
import { spotterDb } from '~/services/dexieinit'
import uuidv4 from 'uuid/v4'
import * as firebase from 'firebase/app'

export default {
  components: {
    LockedComp
  },

  data: () => ({
    isCompLocked: false,
    rowPerPageItems: [10, 25, 50, { text: 'All', value: -1 }],
    rowsPerPageText: 'Teams per page: ',
    search: null,
    showTeamDialog: false,
    saveWaiting: false,
    teamAbbreviation: null,
    teamName: null,
    teamId: null,
    modalDob: null,
    valid: false,
    deleting: false,
    teamToDelete: null,
    showDeleteDialog: false,
    headers: [
      {
        text: '',
        value: 'action',
        sortable: false
      },
      {
        text: 'Abbreviation',
        align: 'left',
        value: 'abbreviation'
      },
      {
        text: 'Full Name',
        align: 'left',
        value: 'name'
      },
      {
        text: '',
        value: 'action',
        sortable: false
      }
    ],
    items: [],
    teams: []
  }),

  computed: {
    dialogTitle: function() {
      return this.showTeamDialog ? 'Add Team' : 'Edit Team'
    },
    teamToDeleteName: function() {
      if (!this.teamToDelete) return null
      return this.teamToDelete.abbreviation
    },
    teamHeaders: function() {
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
    const comp = await CurrentComp(this.$route.params.id)
    this.isCompLocked = comp.locked

    this.teams = await spotterDb.teams
      .where('comp_ref')
      .equals(this.$route.params.id)
      .toArray()
  },

  methods: {
    showDeleteTeam(team) {
      this.teamToDelete = team
      this.showDeleteDialog = true
    },
    async deleteTeam() {
      const result = await spotterDb.comps
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()
      if (result.length != 1) return

      const compId = result[0].id

      // Nuke the team
      await firestore
        .collection('comps')
        .doc(compId)
        .collection('teams')
        .doc(this.teamToDelete.id)
        .delete()

      // Get update the affected lifters
      const affectedLifters = await spotterDb.lifters
        .where('team')
        .equals(this.teamToDelete.abbreviation)
        .toArray()

      let batch = firestore.batch()

      // Now updat the lifters but do it in a batch operation
      affectedLifters.forEach(lifter => {
        let lifterRef = firestore
          .collection('comps')
          .doc(compId)
          .collection('lifters')
          .doc(lifter.id)

        batch.update(lifterRef, {
          team: firebase.firestore.FieldValue.delete()
        })
      })

      await batch.commit()

      await spotterDb.teams
        .where('abbreviation')
        .equals(this.teamToDelete.abbreviation)
        .delete()

      const teamIndex = this.teams.findIndex(
        x => x.abbreviation == this.teamToDelete.abbreviation
      )
      this.teams.splice(teamIndex, 1)

      this.deleting = false
      this.showDeleteDialog = false
      this.teamToDelete = null
    },
    addTeam() {
      this.teamAbbreviation = null
      this.teamName = null
      this.teamId = null
      this.$refs.form.reset()
      this.showTeamDialog = true
    },
    async saveTeam() {
      if (this.$refs.form.validate()) {
        this.saveWaiting = true

        if (this.teamId) {
          await this.saveExistingTeam()
        } else {
          await this.saveNewTeam()
        }

        this.teams = await spotterDb.teams
          .where('comp_ref')
          .equals(this.$route.params.id)
          .toArray()

        this.teamAbbreviation = null
        this.teamName = null
        this.teamId = null
        this.saveWaiting = false
        this.showTeamDialog = false
      }
    },
    async saveExistingTeam() {
      const result = await spotterDb.comps
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()
      if (result.length != 1) return

      const compId = result[0].id
      if (compId) {
        const teamToEdit = this.teams.filter(team => team.id == this.teamId)
        const liftersToUpdate = await spotterDb.lifters
          .where('comp_ref')
          .equals(this.$route.params.id)
          .and(lifter => lifter.team == teamToEdit[0].abbreviation)
          .toArray()

        if (liftersToUpdate.length > 0) {
          let batch = firestore.batch()

          liftersToUpdate.forEach(lifter => {
            let lifterRef = firestore
              .collection('comps')
              .doc(compId)
              .collection('lifters')
              .doc(lifter.id)

            batch.update(lifterRef, {
              team: this.teamAbbreviation
            })
          })

          await batch.commit()
        }

        const team = {
          abbreviation: this.teamAbbreviation,
          name: this.teamName
        }

        await firestore
          .collection('comps')
          .doc(compId)
          .collection('teams')
          .doc(this.teamId)
          .update(team)

        spotterDb.teams.update(this.teamId, team)
      }
    },
    async saveNewTeam() {
      const result = await spotterDb.comps
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()
      if (result.length != 1) return

      const compId = result[0].id
      if (compId) {
        this.saveWaiting = true
        let teamRef = null
        do {
          teamRef = uuidv4().substring(0, 8)
          const result = await firestore
            .collection('comps')
            .doc(compId)
            .collection('teams')
            .where('team_ref', '==', teamRef)
            .get()

          if (!result.empty) {
            teamRef = null
          }
        } while (teamRef == null)

        const team = {
          abbreviation: this.teamAbbreviation,
          name: this.teamName
        }

        const newTeam = await firestore
          .collection('comps')
          .doc(compId)
          .collection('teams')
          .add(team)

        team.id = newTeam.id
        team.comp_ref = this.$route.params.id
        team.compid = compId

        spotterDb.teams.put(team)
      }
    },
    editTeam(team) {
      this.teamAbbreviation = team.abbreviation
      this.teamName = team.name
      this.teamId = team.id
      this.showTeamDialog = true
    }
  }
}
</script>
