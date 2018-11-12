import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import languageCfg from '../config/language'
import dictionary from '@/locales/dictionary'

Vue.use(VeeValidate)
Validator.localize(languageCfg.default, languageCfg.veeValidateMessages[languageCfg.default])
Validator.localize(dictionary)
