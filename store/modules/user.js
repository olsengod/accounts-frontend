import ls from 'local-storage'

const state = {
  user: {
    accessToken: null,
    refreshToken: null,
    expireIn: null,
    isAuthenticated: false
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
