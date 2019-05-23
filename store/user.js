import { auth } from '~/services/fireinit.js'
import { spotterDb } from '~/services/dexieinit'

export const state = () => ({
  currentUser: {}
})

export const getters = {
  activeUser: state => {
    return state.currentUser
  }
}

export const mutations = {
  setUser(state, newUser) {
    localStorage.currentUser = null
    if (newUser == null) {
      state.currentUser = {}
    } else {
      // I can't put in the whole user object or else it will barf,
      // complaining that I'm modifying state outside a mutation
      state.currentUser = {
        displayName: newUser.displayName,
        email: newUser.email,
        uid: newUser.uid,
        photoURL: newUser.photoURL,
        emailVerified: newUser.emailVerified
      }
      localStorage.currentUser = newUser.uid
    }
  }
}

export const actions = {
  signOut({ commit }) {
    auth
      .signOut()
      .then(() => {
        localStorage.currentUser = null
        commit('setUser', null)
        commit('recentcomps/clearrecentcomps', null, { root: true })
        spotterDb.comps.clear()
        spotterDb.lifters.clear()
        spotterDb.teams.clear()
        spotterDb.federations.clear()
      })
      .catch(err => console.log(error))
  }
}
