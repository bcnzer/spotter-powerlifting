import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseui from 'firebaseui'

// TODO - enter your config from your Firestore account here
var config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: ''
}

!firebase.apps.length ? firebase.initializeApp(config) : ''
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const authui = new firebaseui.auth.AuthUI(firebase.auth())
export const firestore = firebase.firestore()
export default firebase
