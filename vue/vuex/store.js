Vue.use(Vuex);

const state = {
	count: 1
};

const mutations = {
	add(state, value) {
		state.count += value;
	},
	reduce(state) {
		state.count--;
	}
};

const actions = {
	addAction(context, fn) {
		setTimeout(() => {
			context.commit('add', 99);
			fn(99);
		}, 1000);
	}
};

const VuexState = new Vuex.Store({

});
