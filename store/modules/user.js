import ls from 'local-storage'
// import {storageHost, accountsStorage} from '@/plugins/local-storage'
import languageCfg from '../../config/language'
import axios from 'axios'
import { Validator } from 'vee-validate'

const httpCfg = require('@/config/http')[process.env.IS_DEV ? 'is_dev' : 'is_prod']

const state = {
  user: {
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
    isAuthenticated: false,
    data: {
      email: null,
      username: null,
      phone: null,
      registerAt: null,
      lastLogin: null,
      state: null,
      isAdmin: false,
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
    state.user.expiresIn = value
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
  SET_ISADMIN (state, value) {
    state.user.data.isAdmin = value
  },
  SET_LANGUAGE (state, data) {
    state.user.data.data.language = data.value
    data.i18n.locale = data.value
    Validator.localize(data.value, languageCfg.veeValidateMessages[data.value])
  },
  RESET_USER (state) {
    ls.clear()
    state.user = {
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      isAuthenticated: false,
      data: {
        email: null,
        username: null,
        phone: null,
        registerAt: null,
        lastLogin: null,
        state: null,
        isAdmin: false,
        data: {
          language: languageCfg.default
        }
      }
    }
  }
}

const actions = {
  setTokens ({commit, dispatch}, {data}) {
    commit('SET_ACCESS_TOKEN', data.accessToken)
    commit('SET_REFRESH_TOKEN', data.refreshToken)
    commit('SET_EXPIRES_IN', data.expiresIn)
    ls.set('cererisAccountAccessToken', data.accessToken)
    ls.set('cererisAccountRefreshToken', data.refreshToken)
    ls.set('cererisExpiresIn', data.expiresIn)
    // accountsStorage.set('cererisAccountAccessToken', data.accessToken, (error, data) => {
    //   console.log('errSet1', error, 'data ', data)
    //   accountsStorage.set('cererisAccountRefreshToken', data.refreshToken, (error, data) => {
    //     console.log('errSet2', error, 'data ', data)
    //     accountsStorage.set('cererisExpiresIn', data.expiresIn, (error, data) => {
    //       console.log('errSet3', error, 'data ', data)
    //       let currentTime = Date.now()
    //       console.log('cur', currentTime)
    //       console.log('exp', data.expiresIn)
    //       setTimeout(function () {
    //         axios({
    //           method: 'post',
    //           url: httpCfg.backendURL + '/api/v1/tokens/refresh',
    //           data: { refreshToken: state.user.refreshToken },
    //           validateStatus: function (status) {
    //             return status === 200
    //           }
    //         }).then((tokenResponse) => {
    //           tokenResponse.data.data.redirect = data.redirect
    //           dispatch('setTokens', { data: tokenResponse.data.data })
    //         }).catch((err) => {
    //           data.redirect('/signin')
    //           console.log(err)
    //         })
    //       }, data.expiresIn - currentTime) //  3540000)
    //     })
    //   })
    // })

    let currentTime = Date.now()
    setTimeout(function () {
      axios({
        method: 'post',
        url: httpCfg.backendURL + '/api/v1/tokens/refresh',
        data: { refreshToken: state.user.refreshToken },
        validateStatus: function (status) {
          return status === 200
        }
      }).then((tokenResponse) => {
        tokenResponse.data.data.redirect = data.redirect
        dispatch('setTokens', { data: tokenResponse.data.data })
      }).catch((err) => {
        data.redirect('/signin')
        console.log(err)
      })
    }, data.expiresIn - currentTime)
  },
  setUser ({commit}, {data, i18n}) {
    // console.log('set user', i18n.locale)
    if (data.email) commit('SET_EMAIL', data.email)
    if (data.username) commit('SET_USERNAME', data.username)
    if (data.registerAt) commit('SET_REGISTER_AT', data.registerAt)
    if (data.lastLogin) commit('SET_LAST_LOGIN', data.lastLogin)
    if (data.state) commit('SET_STATE', data.state)
    if (data.isAdmin) commit('SET_ISADMIN', data.isAdmin)
    if (data.data.language) commit('SET_LANGUAGE', { value: data.data.language, i18n })
  }
}

const getters = {
  isAuthenticated: state => {
    return state.user.isAuthenticated
  },
  state: state => {
    return state.user.data.state
  },
  accessToken: state => {
    return state.user.accessToken
  },
  username: state => {
    return state.user.data.email
  },
  isAdmin: state => {
    return state.user.data.isAdmin
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
