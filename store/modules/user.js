import ls from 'local-storage'
import languageCfg from '../../config/language'
import { Validator } from 'vee-validate'

const state = {
  user: {
    accessToken: null,
    refreshToken: null,
    expireIn: null,
    isAuthenticated: false,
    data: {
      email: null,
      username: null,
      phone: null,
      registerAt: null,
      lastLogin: null,
      state: null,
      data: {
        language: languageCfg.default
      }
    }
  }
}

const mutations = {
  SET_IS_AUTHENTICATED (state, value) {
    state.user.isAuthenticated = value
  },
  SET_ACCESS_TOKEN (state, value) {
    state.user.accessToken = value
  },
  SET_REFRESH_TOKEN (state, value) {
    state.user.refreshToken = value
  },
  SET_EXPIRES_IN (state, value) {
    state.user.expireIn = value
  },
  SET_EMAIL (state, value) {
    state.user.data.email = value
  },
  SET_USERNAME (state, value) {
    state.user.data.username = value
  },
  SET_REGISTER_AT (state, value) {
    state.user.data.registerAt = value
  },
  SET_LAST_LOGIN (state, value) {
    state.user.data.lastLogin = value
  },
  SET_STATE (state, value) {
    state.user.data.state = value
  },
  SET_LANGUAGE (state, value, i18n) {
    state.user.data.data.language = value
    i18n.locale = value
    Validator.localize(value, languageCfg.veeValidateMessages[value])
  }
}

const actions = {
  setTokens ({commit}, {data}) {
    commit('SET_IS_AUTHENTICATED', true)
    commit('SET_ACCESS_TOKEN', data.accessToken)
    commit('SET_REFRESH_TOKEN', data.refreshToken)
    commit('SET_EXPIRES_IN', data.expireIn)
    ls.set('cererisAccountAccessToken', data.accessToken)
    ls.set('cererisAccountRefreshToken', data.refreshToken)
  },
  setUser ({commit}, {data, i18n}) {
    console.log(i18n.locale)
    if (data.email) commit('SET_EMAIL', data.email)
    if (data.username) commit('SET_USERNAME', data.username)
    if (data.registerAt) commit('SET_REGISTER_AT', data.registerAt)
    if (data.lastLogin) commit('SET_LAST_LOGIN', data.lastLogin)
    if (data.state) commit('SET_STATE', data.state)
    if (data.data.language) commit('SET_LANGUAGE', data.data.language, i18n)
  }
}

const getters = {
  isAuthenticated: state => {
    return state.user.isAuthenticated
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
