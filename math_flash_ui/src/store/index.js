import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import AuthenticationModule from './auth';
import MultiplicationModule from './multiplication'
import StatsModule from './stats';

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
    multiplication: MultiplicationModule,
    stats: StatsModule
  }
})
