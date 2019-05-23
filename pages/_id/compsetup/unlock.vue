<template>
  <v-layout
    column
    justify-center
    align-center
    class="mt-4 mx-2">

    <v-flex
      xs12
      sm8
      md6>
      <v-card>
        <v-card-title class="headline">{{ headerText }} 
          <v-icon v-if="isCompLocked">lock</v-icon>
          <v-icon v-if="!isCompLocked">lock_open</v-icon>
        </v-card-title>
        <v-card-text>
          <p>
            Locking a competition is a prerequisite for running a competition.
          </p>
          <p>
            If locked then data such as lifter information and comp details cannot be changed
          </p>
        </v-card-text>
        <v-card-actions 
          v-if="isCompLocked"
        >
          <v-spacer/>
          <v-btn
            :loading="locking"
            color="primary"
            @click="unlockCompetition">Unlock Competition</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { CurrentComp } from '~/utils/indexedDbHelpers'
import { firestore } from '@/services/fireinit.js'
import { spotterDb } from '~/services/dexieinit'

export default {
  data: () => ({
    compId: null,
    isCompLocked: false,
    locking: false
  }),

  computed: {
    headerText: function() {
      if (this.isCompLocked) {
        return 'Competition is locked'
      }
      return 'Competition is unlocked'
    }
  },

  async created() {
    const comp = await CurrentComp(this.$route.params.id)
    this.isCompLocked = comp.locked
    this.compId = comp.id
  },

  methods: {
    unlockCompetition: async function() {
      this.locking = true

      const result = await firestore
        .collection('comps')
        .doc(this.compId)
        .update({
          locked: false
        })

      spotterDb.comps.update(this.compId, {
        locked: false
      })

      this.isCompLocked = false
      this.locking = false
    }
  }
}
</script>
