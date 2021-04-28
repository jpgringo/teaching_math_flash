import {createConnector} from './_connector-core';
const core = createConnector('auth');

function authenticate(credentials) {
  const options = {
    fullResponse: true,
    validateStatus: (status) => {
      return (status <= 200 && status < 300) || status === 401;
    },
    checkResponse: (resp) => {
      if (resp.status === 401) throw({status: resp.status, statusText: resp.statusText});
    }
  }
  return core.post(null, credentials, options)
    .then(resp => resp.data)
    .catch(err => {
      throw err;
    });
}

export default {
  authenticate: authenticate
}
