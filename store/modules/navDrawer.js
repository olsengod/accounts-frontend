const state = {
  navig: false
}

const mutations = {
  SWITCH_NAVIG (state) {
    state.navig = !state.navig
  }
}

const actions = {
  switch ({commit}) {
    commit('SWITCH_NAVIG')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
