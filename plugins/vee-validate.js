import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import languageCfg from '../config/language'
import dictionary from '@/locales/dictionary'

Validator.localize(languageCfg.default, languageCfg.veeValidateMessages[languageCfg.default])
Vue.use(VeeValidate)

Validator.localize(dictionary)
