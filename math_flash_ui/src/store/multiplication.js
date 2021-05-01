import multiplicationConnector from '../connectors/multiplication-connector';

export default {
  namespaced: true,
  state: {
    currentQuestion: undefined,
    latestResponse: undefined
  },
  mutations: {
    newQuestion(state, question) {
      state.currentQuestion = question;
    },
    receivedResponse(state, response) {
      state.latestResponse = response;
    }
  },
  actions: {
    requestNextQuestion({commit, rootGetters}) {
      // console.log(`requesting next question`);
      const authToken = rootGetters["auth/getAuthToken"];
      // console.log(`will get next question:`, authToken);
      multiplicationConnector.getNextQuestion(authToken)
        .then(question => {
          commit('newQuestion', question);
        })
    },
    submitAnswer({state, rootGetters, commit}, userAnswer) {
      const authToken = rootGetters["auth/getAuthToken"];
      // console.log(`submitting answer ${userAnswer} for question:`, state.currentQuestion);
      multiplicationConnector
        .submitAnswer(authToken, state.currentQuestion, parseInt(userAnswer))
        .then(response => {
          commit('receivedResponse', response);
        });
    }
  },
  modules: {
  }
}
