import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'spotterpowerlifting:recentcomps',
      paths: ['recentcomps']
    })(store)
    createPersistedState({
      key: 'spotterpowerlifting:drawer',
      paths: ['drawer']
    })(store)
  })
}
