export const state = () => ({
  runCompCurrentLift: null,
  runCompCurrentFlight: null
})

export const mutations = {
  setRunCompCurrentLift(state, lift) {
    state.runCompCurrentLift = lift
  },
  setRunCompCurrentFlight(state, flight) {
    state.runCompCurrentFlight = flight
  }
}
