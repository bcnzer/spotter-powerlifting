<template lang="html">
  <div id="firebaseui-auth-container" />
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/auth'
import firebaseui from 'firebaseui'
import { auth, authui } from '@/services/fireinit.js'

export default {
  layout: 'auth',

  mounted() {
    var uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    }

    authui.start('#firebaseui-auth-container', uiConfig)
  }
}
</script>
