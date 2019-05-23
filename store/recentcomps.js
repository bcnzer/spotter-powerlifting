export const state = () => ({
  recentCompetitions: []
})

export const mutations = {
  addRecentCompetition(state, comp) {
    while (state.recentCompetitions.length >= 3) {
      state.recentCompetitions.shift()
    }

    for (let index = state.recentCompetitions.length - 1; index >= 0; index--) {
      if (state.recentCompetitions[index].id == comp.id) {
        state.recentCompetitions.splice(index, 1)
      }
    }

    let recentComp = {
      name: comp.name,
      id: comp.id,
      comp_ref: comp.compRef
    }
    state.recentCompetitions.push(recentComp)
  },

  clearrecentcomps(state) {
    state.recentCompetitions = []
  }
}
