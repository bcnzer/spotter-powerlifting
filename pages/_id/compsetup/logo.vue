<template>
  <v-layout
    column
    justify-center
    align-center>
    <locked-comp :show="isCompLocked" />

    <v-flex
      xs12
      class="mt-5">
      <img
        v-if="logoUrl"
        :src="logoUrl">
      <img 
        v-if="!logoUrl && !loadingImage"
        src="~/static/spottersemitrans.png">
      <v-progress-circular
        v-if="loadingImage"
        :size="100"
        indeterminate
        color="primary"
      />
    </v-flex>
    <v-flex
      v-if="!uploading && !loadingImage"
      xs12>
      <input
        v-if="!isCompLocked"
        type="file" 
        @change="onFileChanged" >
      <v-btn
        :disabled="isCompLocked"
        class="info"
        @click.native="onUpload">
        Upload
      </v-btn>
    </v-flex>
    <v-flex
      v-if="uploading"
      xs12>
      <v-progress-circular
        :size="50"
        indeterminate
        color="primary"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import LockedComp from '~/components/lockedcomp/lockedcomp'
import { CurrentComp } from '~/utils/indexedDbHelpers'
import * as firebase from 'firebase/app'
import { firestore } from '@/services/fireinit.js'
import loginAvatar from '~/components/toolbar/loginavatar'
import { spotterDb } from '~/services/dexieinit'
import 'firebase/firebase-storage'

export default {
  components: {
    LockedComp,
    loginAvatar
  },

  data: () => ({
    isCompLocked: false,
    selectedFile: null,
    uploading: false,
    logoUrl: null,
    loadingImage: false
  }),

  async created() {
    const comp = await CurrentComp(this.$route.params.id)
    this.isCompLocked = comp.locked

    if (comp.comp_logo) {
      this.loadingImage = true
      let imageUrl = await firebase
        .storage()
        .ref(comp.comp_logo)
        .getDownloadURL()

      this.logoUrl = imageUrl
      this.loadingImage = false
    }
  },

  methods: {
    onFileChanged(event) {
      this.selectedFile = event.target.files[0]
    },
    async onUpload() {
      const result = await spotterDb.comps
        .where('comp_ref')
        .equals(this.$route.params.id)
        .toArray()
      if (result.length != 1) return
      const compId = result[0].id

      this.uploading = true

      const logoPath = `complogos/${this.$route.params.id}/${
        this.selectedFile.name
      }`
      const uploadTask = await firestoreStorage
        .ref()
        .child(logoPath)
        .put(this.selectedFile)

      await firestore
        .collection('comps')
        .doc(compId)
        .update({
          comp_logo: logoPath
        })

      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        this.logoUrl = downloadURL
        this.uploading = false
      })
    }
  }
}
</script>
