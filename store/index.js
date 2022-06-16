import Vue from 'vue'
import Vuex from 'vuex'

import user from "./modules/user.js"
import category from "./modules/category.js"

Vue.use(Vuex)

const store = new Vuex.Store({
	modules:{
		user,
		category
	}
})

export default store