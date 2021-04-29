import {createConnector} from './_connector-core';
const core = createConnector('stats');

export default {
  getQuestionStats: (authToken) => {
    return core.get('questions', {authToken: authToken});
  },
  getStatsByRange: (authToken) => {
    return core.get('ranges', {authToken: authToken});
  }
}
