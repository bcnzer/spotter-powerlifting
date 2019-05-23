const pkg = require('./package')

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl',
    '@/node_modules/firebaseui/dist/firebaseui.css',
    '~/assets/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/localStorage.js', ssr: false },
    '@/plugins/vuetify',
    '@/plugins/fireauth'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/sentry',
    '@nuxtjs/robots',
    '@nuxtjs/pwa',
    ['@nuxtjs/google-tag-manager', { id: 'GTM-TGWLQC6' }]
  ],

  robots: {
    UserAgent: '*',
    Disallow: '/'
  },

  sentry: {
    dsn: 'https://0df4959eb7164ae2920b566692b70c2a@sentry.io/1409919', // Enter your project's DSN here
    config: {
      disabled: true
    } // Additional config
  },

  router: {
    middleware: ['notloggedin']
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
