import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: '#82B1FF',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    Plate25kg: '#FF0000',
    Plate20kg: '#1673B6',
    Plate15kg: '#EDD406',
    Plate10kg: '#007555',
    Plate5kg: '#F0F0F0',
    Plate2d5kg: '#3D3D3D',
    Plate1d25kg: '#BEBEBE',
    Plate0d5kg: '#BEBEBE',
    Plate0d25kg: '#BEBEBE'
  }
})

// Global keyboard shortcut handler
Vue.use(require('vue-shortkey'))
// Vue.use(Vuetify, {
//   theme: {
//     primary: '#121212', // a color that is not in the material colors palette
//     accent: colors.grey.darken3,
//     secondary: colors.amber.darken3,
//     info: colors.teal.lighten1,
//     warning: colors.amber.base,
//     error: colors.deepOrange.accent4,
//     success: colors.green.accent3
//   }
// })
