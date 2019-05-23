<template>
  <v-container>
    <v-layout 
      row 
      wrap>
      <v-flex 
        xs12 
        class="mr-1">
        <v-select
          label="Current Lift"
        />
      </v-flex>

      <v-flex 
        xs12 
        class="ml-1">
        <v-select
          label="Flight"
        />
      </v-flex>
      <v-flex 
        xs12>
        <v-expansion-panel popout>
          <v-expansion-panel-content
            v-for="(item,i) in 15"
            :key="i"
          >
            <template v-slot:header>
              <div><b>CHARTRAND B</b> - S 120 | 125 | 127.5 - B 97.5 | 100 | 105.5 - D 132.5 | 140 | 142.5</div>
            </template>
            <v-card>
              <v-card-text>
                <p>CHARTRAND</p>
                <p>Ben</p>
                <p>Squat 1 - 120 kg</p>
              </v-card-text>
            </v-card>
            <v-card-actions>
              <v-btn
                color="success"
                class="mx-0"
                @click="testThis(item)"
              >Good Lift</v-btn>
              <v-btn
                color="error"
                class="mx-1"
              >No Lift</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import liftNames from '~/utils/liftNameConstants'

export default {
  data: () => ({
    lifts: [
      liftNames.Squat1,
      liftNames.Squat2,
      liftNames.Squat3,
      liftNames.Bench1,
      liftNames.Bench2,
      liftNames.Bench3,
      liftNames.Deadlift1,
      liftNames.Deadlift2,
      liftNames.Deadlift3
    ]
  }),

  methods: {
    testThis: function(item) {
      console.log(item)
    }
  }
}
</script>
