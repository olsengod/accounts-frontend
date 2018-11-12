const state = {
  navig: {
    title: null,
    path: null
  }
}

const mutations = {
  SET_TITLE (state, value) {
    state.navig.title = value
  },
  SET_PATH (state, value) {
    state.navig.path = value
  }
}

const actions = {
  navigate ({commit}, {data}) {
    commit('SET_TITLE', data.title)
    commit('SET_PATH', data.path)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
