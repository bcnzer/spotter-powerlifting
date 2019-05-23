export const state = () => ({
  minimize: false,
  show: true
})

export const mutations = {
  minimize(state, minimize) {
    state.minimize = minimize
  },
  show(state, show) {
    state.show = show
  }
}
