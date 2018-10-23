Vue.use(Vuex);

const state = {
	count: 1
};

const mutations = {
    add(state){
        state.count++;
    },
    reduce(state){
        state.count--;
    }
}

const VuexState = new Vuex.Store({
    state,
    mutations
})
