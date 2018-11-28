import Vue from 'vue'
import VueI18n from 'vue-i18n'
import languageCfg from '../config/language'
import Vuetify from 'vuetify'

Vue.use(VueI18n)

export default ({ app, store }) => {
  app.i18n = new VueI18n({
    locale: languageCfg.default,
    messages: {
      'en': require('~/locales/en.json'),
      'ru': require('~/locales/ru.json')
    }
  })
  Vue.use(Vuetify, {
    lang: {
      t: (key, ...params) => app.i18n.t(key, params)
    }
  })
}

// Vue.use(Vuetify, {
//   lang: {
//     t: (key, ...params) => i18n.t(key, params)
//   }
// })
