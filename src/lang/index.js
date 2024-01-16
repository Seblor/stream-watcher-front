import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

const messages = {
  en: require('./en.json'),
  fr: require('./fr.json')
}

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  silentTranslationWarn: location.hostname !== 'localhost',
  messages
})
