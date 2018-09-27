const state = {
  user: {
    accessToken: null,
    refreshToken: null,
    expireIn: null,
    isAuthenticated: false
  }
}

const mutations = {
  SET_AUTH (state, value) {
    state.user.isAuthenticated = value
  }
}

const actions = {
  set_auth ({commit}, {value}) {
    commit('SET_AUTH', value)
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
