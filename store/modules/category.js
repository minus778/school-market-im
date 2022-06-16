import { getCategory } from "../../network/fabu.js";
const state = {
	//分类名字信息
	categoryInfo:[],
	categoryList:[]
}
const mutations = {
	async getCategoryName(state){
		const { data: res } = await getCategory();
		state.categoryInfo = res.data;
		state.categoryList = res.data.map((item) => item.name);
	}
}
const actions = {
}
const getters = {}

export default{
	namespaced:true,
	state,
	mutations,
	actions,
	getters
}