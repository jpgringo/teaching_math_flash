import AuthConnector from '@/connectors/auth-connector'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    authToken: undefined,
    displayName: ''
  },
  mutations: {
    updateLoginInfo(state, loginInfo) {
      state.authToken = loginInfo.token;
      state.displayName = loginInfo.user.displayName;
    },
    logOut(state) {
      state.authToken = undefined;
    }
  },
  getters: {
    isLoggedIn: state => {
      return state.authToken !== undefined;
    },
    getAuthToken: state => {
      return state.authToken;
    }
  },
  actions: {
    authenticate({commit,dispatch}, credentials) {
      console.log(`will authenticate with credentials:`, credentials);
      AuthConnector.authenticate(credentials)
        .then(data => {
          console.log(`data:`, data);
          commit('updateLoginInfo', data);
          // router.push('/'); // there's only one page, currently
        })
        .catch(err => console.log(`authentication error:`, err))
    },
    logOut({commit/*, dispatch*/}) {
      commit('logOut');
      // dispatch('clearAll', null, {root: true});
      // if(router.currentRoute.name !== 'About') {
      //   router.push('/about');
      // }
    }
  },
  modules: {
  }
}
