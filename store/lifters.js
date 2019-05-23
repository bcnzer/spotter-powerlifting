export const state = () => ({
  lifters: []
})

export const mutations = {
  saveLifter(state, lifterDetails) {
    if (!lifterDetails || !lifterDetails.compId) return

    const allLifters = state.lifters.filter(
      lifter => lifter.id == lifteDetails.id
    )

    if (allLifters.length !== 1) return

    lifter = allLifters[0]
  },
  clearLifters(state) {
    state.lifters = []
  },
  addLifter(state, lifter) {
    state.lifters.push(lifter)
  }
}
