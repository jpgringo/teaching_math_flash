import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import MultiplicationModule from './multiplication'
import AuthenticationModule from './auth';

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth: AuthenticationModule,
    multiplication: MultiplicationModule
  }
})
