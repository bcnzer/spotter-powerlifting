<template>
  <v-layout
    column
    justify-center
    align-center>

    <v-flex
      xs12
      sm8
      md6>
      <v-card>
        <v-card-title class="headline">Lifters</v-card-title>
        <v-card-text>
          <hr class="my-3">
          <a
            href="https://nuxtjs.org/"
            target="_blank">Nuxt Documentation</a>
          <br>
          <a
            href="https://github.com/nuxt/nuxt.js"
            target="_blank">Nuxt GitHub</a>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="primary"
            flat
            nuxt
            to="/login">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
