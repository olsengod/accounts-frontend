const state = {
  height: 0
}

const mutations = {
  SET_HEIGHT (state, value) {
    state.height = value
  }
}

const getters = {
  height: state => {
    return state.height
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
