import multiplicationConnector from '../connectors/multiplication-connector';

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    requestNextQuestion() {
      multiplicationConnector.getNextQuestion()
        .then(response => {
          console.log(`resp:`, response);
        })
    }
  },
  modules: {
  }
}
