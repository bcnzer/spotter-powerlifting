import liftNames from '~/utils/liftNameConstants'

export const state = () => ({
  isWeightDialogVisible: false,
  weightDialogLifter: null,
  weightDialogLiftType: null,
  weightDialogWeight: null
})

export const mutations = {
  lift(state, lift) {
    state.weightDialogLiftType = lift
  },
  weight(state, weight) {
    state.weightDialogWeight = weight
  },
  show(state, lifter) {
    state.weightDialogLifter = lifter
    state.isWeightDialogVisible = true
  },
  close(state) {
    state.isWeightDialogVisible = false
    state.weightDialogLifter = null
    state.weightDialogLiftType = null
    state.weightDialogWeight = null
  }
}
