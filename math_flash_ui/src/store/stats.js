import statsConnector from '../connectors/stats-connector';

export default {
  namespaced: true,
  state: {
    rangeStats: undefined,
    detailedStats: undefined
  },
  mutations: {
    detailedStats(state, stats) {
      state.detailedStats = stats;
    },
    rangeStats(state, stats) {
      state.rangeStats = stats;
    }
  },
  actions: {
    getLatestStats({commit, rootGetters}) {
      const authToken = rootGetters["auth/getAuthToken"];
      // console.log(`will get next question:`, authToken);
      statsConnector.getStatsByRange(authToken)
        .then(stats => {
          commit('rangeStats', stats);
        })
      statsConnector.getQuestionStats(authToken)
        .then(stats => {
          commit('detailedStats', stats);
        })
    }
  },
  modules: {
  }
}
