<template>
  <v-container grid-list-sm> 
    <locked-comp :show="isCompLocked" />

    <v-layout row>
      <v-flex
        xs12
        sm6
        md4>
        <v-select
          :readonly="isCompLocked"
          :items="barbellWeights"
          v-model="barbellWeight"
          item-text="weightText"
          item-value="weightValue"
          label="Weight of Barbell Plus Collars"
        />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        sm6
        md4>
        <v-select
          :readonly="isCompLocked"
          :items="plateCounts"
          v-model="plates25kg"
          item-text="plateCount"
          item-value="count"
          label="25 kg Plates"
        />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        sm6
        md4>
        <v-select
          :readonly="isCompLocked"
          :items="plateCounts"
          v-model="plates20kg"
          item-text="plateCount"
          item-value="count"
          label="20 kg Plates"
        />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        sm6
        md4>
        <v-select
          :readonly="isCompLocked"
          :items="plateCounts"
          v-model="plates15kg"
          item-text="plateCount"
          item-value="count"
          label="15 kg Plates"
        />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        sm6
        md4>
        <v-select
          :readonly="isCompLocked"
          :items="plateCounts"
          v-model="plates10kg"
          item-text="plateCount"
          item-value="count"
          label="10 kg Plates"
        />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        sm6
        md4>
        <v-select
          :readonly="isCompLocked"
          :items="plateCounts"
          v-model="plates5kg"
          item-text="plateCount"
          item-value="count"
          label="5 kg Plates"
        />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        sm6
        md4>
        <v-select
          :readonly="isCompLocked"
          :items="plateCounts"
          v-model="plates2d5kg"
          item-text="plateCount"
          item-value="count"
          label="2.5 kg Plates"
        />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        sm6
        md4>
        <v-select
          :readonly="isCompLocked"
          :items="plateCounts"
          v-model="plates1d25kg"
          item-text="plateCount"
          item-value="count"
          label="1.25 kg Plates"
        />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        sm6
        md4>
        <v-select
          :readonly="isCompLocked"
          :items="plateCounts"
          v-model="plates0d5kg"
          item-text="plateCount"
          item-value="count"
          label="0.5 kg Plates"
        />
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        sm6
        md4>
        <v-select
          :readonly="isCompLocked"
          :items="plateCounts"
          v-model="plates0d25kg"
          item-text="plateCount"
          item-value="count"
          label="0.25 kg Plates"
        />
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-btn
        :disabled="saving || isCompLocked"
        :loading="saving"
        class="info"
        @click="submit"
      >
        Save
      </v-btn>
    </v-layout>
  </v-container>
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
    saving: false,

    isCompLocked: false,
    barbellWeight: null,
    plates25kg: null,
    plates20kg: null,
    plates15kg: null,
    plates10kg: null,
    plates5kg: null,
    plates2d5kg: null,
    plates1d25kg: null,
    plates0d5kg: null,
    plates0d25kg: null,

    plateCounts: [
      { plateCount: '0', count: 0 },
      { plateCount: '2', count: 2 },
      { plateCount: '4', count: 4 },
      { plateCount: '6', count: 6 },
      { plateCount: '8', count: 8 },
      { plateCount: '10', count: 10 },
      { plateCount: '12', count: 12 },
      { plateCount: '14', count: 14 },
      { plateCount: '16', count: 16 },
      { plateCount: '18', count: 18 },
      { plateCount: '20', count: 20 }
    ],
    barbellWeights: [
      { weightText: '25 kg', weightValue: 25 },
      { weightText: '22.5 kg', weightValue: 22.5 },
      { weightText: '20 kg', weightValue: 20 }
    ]
  }),

  async created() {
    const comp = await CurrentComp(this.$route.params.id)
    this.isCompLocked = comp.locked

    this.barbellWeight = comp.plates.barbell_weight
    this.plates25kg = comp.plates.plates25kg
    this.plates20kg = comp.plates.plates20kg
    this.plates15kg = comp.plates.plates15kg
    this.plates10kg = comp.plates.plates10kg
    this.plates5kg = comp.plates.plates5kg
    this.plates2d5kg = comp.plates.plates2d5kg
    this.plates1d25kg = comp.plates.plates1d25kg
    this.plates0d5kg = comp.plates.plates0d5kg
    this.plates0d25kg = comp.plates.plates0d25kg
  },

  methods: {
    async submit() {
      this.saving = true
      const result = await spotterDb.comps
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()
      if (result.length != 1) return

      const compId = result[0].id

      if (compId) {
        const compPlates = {
          plates: {
            barbell_weight: this.barbellWeight,
            plates25kg: this.plates25kg,
            plates20kg: this.plates20kg,
            plates15kg: this.plates15kg,
            plates10kg: this.plates10kg,
            plates5kg: this.plates5kg,
            plates2d5kg: this.plates2d5kg,
            plates1d25kg: this.plates1d25kg,
            plates0d5kg: this.plates0d5kg,
            plates0d25kg: this.plates0d25kg
          }
        }

        let compRef = firestore.collection('comps').doc(compId)
        await compRef.update(compPlates)

        await spotterDb.comps.update(compId, compPlates)

        this.$store.commit('snackbar/setSnack', 'Plates saved')
      }
      this.saving = false
    }
  }
}
</script>
