import multiplicationConnector from '../connectors/multiplication-connector';

export default {
  namespaced: true,
  state: {
    currentQuestion: undefined
  },
  mutations: {
    newQuestion(state, question) {
      state.currentQuestion = question;
    }
  },
  actions: {
    requestNextQuestion({commit, rootGetters}) {
      const authToken = rootGetters["auth/getAuthToken"];
      console.log(`will get next question:`, authToken);
      multiplicationConnector.getNextQuestion(authToken)
        .then(question => {
          commit('newQuestion', question);
        })
    }
  },
  modules: {
  }
}
