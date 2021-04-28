import axios from "axios";

function createConnector(resourceId) {
  const apiUrl = (() => {
    const host = process.env.VUE_APP_API_HOST || '';
    const port = process.env.VUE_APP_API_PORT || '';
    const path = process.env.VUE_APP_API_PATH || '/api';
    return `${host}${port ? ':' + port : ''}${path}`;
    // return path;
  })();

  const get = (path, options) => {
    const url = `${apiUrl}/${resourceId}/${path}`;
    const config = {url: url, method: 'get'}
    if (options) {
      if (options.authToken) {
        config.headers = {'Authorization': 'Bearer ' + options.authToken};
      }
    }
    console.log(`get:`, config);
    return axios.request(config)
      .then(resp => options && options.fullResponse ? resp : resp.data)
      .catch(err => err);
  }

  const post = (path, payload, options = {}) => {
    console.log(`post: ${resourceId}, ${path}, ${payload}, options:`, options);
    const validate = (status) => {
      return (status <= 200 && status < 300) || status === 401;
    };
    const url = `${apiUrl}/${resourceId}${(path ? '/' + path : '')}`;
    const config = {url: url, method: 'post', data: payload};
    if (options) {
      if (options.authToken) {
        config.headers = {'Authorization': 'Bearer ' + options.authToken};
      }
      if (options.validateStatus) config.validateStatus = options.validateStatus;
    }
    console.log(`post:`, config);
    return axios.request(config)
      .then(resp => {
        if (options.checkResponse) options.checkResponse(resp);
        return options && options.fullResponse ? resp : resp.data;
      })
      .catch(err => console.log(`ERROR:`, err));
  }

  const checkConnection = (authToken) => {
    return get('test', authToken ? {authToken: authToken, fullResponse: true} : undefined);
  }

  return {
    apiUrl: (() => apiUrl)(),
    get: get,
    post: post,
    checkConnection: checkConnection
  }

}

export {
  createConnector
};

