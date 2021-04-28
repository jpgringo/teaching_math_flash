import statsConnector from '../connectors/stats-connector';

export default {
  namespaced: true,
  state: {
    latestStats: undefined
  },
  mutations: {
    latestStats(state, stats) {
      state.latestStats = stats;
    }
  },
  actions: {
    getLatestStats({commit, rootGetters}) {
      const authToken = rootGetters["auth/getAuthToken"];
      console.log(`will get next question:`, authToken);
      statsConnector.getQuestionStats(authToken)
        .then(stats => {
          commit('latestStats', stats);
        })
    }
  },
  modules: {
  }
}
