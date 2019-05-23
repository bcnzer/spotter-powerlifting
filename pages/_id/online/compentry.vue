<template>
  <v-layout
    column
    justify-center
    align-center>

    <v-layout
      row
      wrap>
      <v-flex
        xs12
        sm6
        md3>
        <v-dialog
          ref="modalEntriesDateOpenDialog"
          v-model="modalEntriesDateOpen"
          :return-value.sync="onlineEntriesOpenDate"
          persistent
          lazy
          full-width
          width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="onlineEntriesOpenDate"
            :rules="[v => (!!v || onlineEntriesOpenTime === null) || 'Entries Open Date is required']"
            label="Entries Open Date"
            prepend-icon="event"
            readonly
          />
          <v-date-picker
            v-model="onlineEntriesOpenDate"
            scrollable>
            <v-spacer />
            <v-btn
              flat
              color="primary"
              @click="modalEntriesDateOpen = false">
              Cancel
            </v-btn>
            <v-btn
              flat
              color="primary"
              @click="$refs.modalEntriesDateOpenDialog.save(onlineEntriesOpenDate)">
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
          :time="onlineEntriesOpenTime"
          text-label="Entries Open Time"
          @time-saved="onLiftingStartTimeSelected" />
      </v-flex>

      <v-flex
        xs12
        sm6
        md3>
        <v-dialog
          ref="onlineEntriesCloseDateDialog"
          v-model="modalEntriesDateClose"
          :return-value.sync="onlineEntriesCloseDate"
          persistent
          lazy
          full-width
          width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="onlineEntriesCloseDate"
            :rules="[v => (!!v || onlineEntriesCloseTime === null) || 'Entries Close Date is required']"
            label="Entries Close Date"
            prepend-icon="event"
            readonly
          />
          <v-date-picker
            v-model="onlineEntriesCloseDate"
            scrollable>
            <v-spacer />
            <v-btn
              flat
              color="primary"
              @click="modalEntriesDateClose = false">
              Cancel
            </v-btn>
            <v-btn
              flat
              color="primary"
              @click="$refs.onlineEntriesCloseDateDialog.save(onlineEntriesCloseDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>

      <v-flex
        xs12
        sm6
        md3>
        <v-dialog
          ref="onlineEntriesCloseDialog"
          v-model="modalEntriesTimeClose"
          :return-value.sync="onlineEntriesCloseTime"
          persistent
          lazy
          full-width
          width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="onlineEntriesCloseTime"
            :rules="[v => (!!v || onlineEntriesCloseDate === null) || 'Entries Close Date is required']"
            label="Entries Close Time"
            prepend-icon="access_time"
            readonly
          />
          <v-time-picker
            v-model="onlineEntriesCloseTime"
            scrollable>
            <v-spacer />
            <v-btn
              flat
              color="primary"
              @click="modalEntriesTimeClose = false">
              Cancel
            </v-btn>
            <v-btn
              flat
              color="primary"
              @click="$refs.onlineEntriesCloseDialog.save(onlineEntriesCloseTime)">
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12>
        <v-textarea
          v-model="legalWaiverMessage"
          label="Legal Waiver Message"
        />
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12>
        <v-textarea
          v-model="notesForLifters"
          label="Notes For Lifters"
        />
      </v-flex>
    </v-layout>

    <v-flex
      xs12
      sm8
      md6>
      <v-card>
        <v-card-title class="headline">Flights</v-card-title>
        <v-card-text>
          <hr class="my-3">
          <a
            href="https://nuxtjs.org/"
            target="_blank">Nuxt Documentation</a>
          <br>
          <a
            href="https://github.com/nuxt/nuxt.js"
            target="_blank">Nuxt GitHub</a>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="primary"
            flat
            nuxt
            to="/login">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
