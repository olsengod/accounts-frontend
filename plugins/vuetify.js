import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import languageCfg from '../config/language'

Vue.use(VueI18n)
const vuetifyMessages = {
  en: {
    dataIterator: {
      rowsPerPageText: 'Items per page:',
      pageText: '{0}-{1} of {2}',
      nextPage: 'Next page',
      prevPage: 'Previous page'
    },
    noDataText: 'No data available.'
  },
  ru: {
    dataIterator: {
      rowsPerPageText: 'Строк а странице:',
      pageText: '{0}-{1} из {2}',
      nextPage: 'Следующая страница',
      prevPage: 'Предыдущая страница'
    },
    noDataText: 'Нет данных.'
  }
}
Vue.use(Vuetify, {
  lang: {
    current: languageCfg.default,
    locales: vuetifyMessages
  }
})
