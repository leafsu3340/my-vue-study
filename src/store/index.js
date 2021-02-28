import Vue from "vue";
// import Vuex from 'vuex'
import Vuex from "@/kvuex/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    counter: 1,
  },
  getters: {
    doubleCounter(state) {
      console.log('counter*2')
      return state.counter * 2;
    },
    tribleCounter(state) {
      console.log('counter*3')
      return state.counter * 3;
    },
  },
  mutations: {
    add(state, data) {
      state.counter++;
    },
  },
  actions: {
    add({ commit }, data) {
      setTimeout(() => {
        commit("add");
      }, 2000);
    },
  },
  modules: {},
});
