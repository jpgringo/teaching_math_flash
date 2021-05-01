import {createConnector} from './_connector-core';
const core = createConnector('multiplication');

export default {
  getNextQuestion: (authToken) => {
    return core.get('questions/next', {authToken: authToken});
  },
  submitAnswer: (authToken, question, answer) => {
    return core.post('questions/answer', {question: question, answer: answer}, {authToken: authToken});
  }

}
