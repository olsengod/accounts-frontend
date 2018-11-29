import Vue from 'vue'
import VueI18n from 'vue-i18n'
import languageCfg from '../config/language'

Vue.use(VueI18n)

export default ({ app }) => {
  app.i18n = new VueI18n({
    locale: languageCfg.default,
    messages: {
      'en': require('~/locales/en.json'),
      'ru': require('~/locales/ru.json')
    }
  })
}
