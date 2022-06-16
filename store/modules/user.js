import {updateUserInfo,getUserfabu,getUserSell,getUserBuy} from '../../network/index.js'
const state = {
	//用户信息
	userInfo:{},
	token:null,
	userSchool:{},
	userShop:{}
}
const mutations = {
	//保存用户信息
	saveUserInfo(state,data){
		// if(!data.nickname||!data.image){
		// 	data.nickname="请登录"
		// 	data.image = '../../static/images/tx.png'
		// }
		state.userInfo = data
		state.token = data.token
		//token持久化存储到本地
		uni.setStorageSync('login-token',data.token)
	},
  
  //保存用户学校信息
  saveUserSchool(state,data){
	state.userSchool = data
	//持久化存储到本地
	uni.setStorageSync('userSchool',data)
  },
  //将本地学校信息赋值给仓库学校信息并将用户信息保存至服务器
  updateSchool(state){
	  state.userInfo.school = uni.getStorageSync('userSchool')
  },
  //修改用户信息
  updateInfo(state,data){
	  state.userInfo.image = data.image
	  state.userInfo.nickname = data.nickname
	  state.userInfo.gender = data.gender
	  // state.userInfo.weChart = data.weChart
	  // state.userInfo.qq = data.qq
	  state.userInfo.phone = data.phone
	  console.log('获取的用户信息：',state.userInfo)
  },
  //保存用户商品信息
  saveUserShop(state,data){
	  state.userShop = data
  }
}
const actions = {
	async updateSchoolInfo({commit}){
		let school = uni.getStorageSync('userSchool')
		let {data:res} = await updateUserInfo({school})
		commit('updateSchool')
	},
	//获取用户买到/卖出/发布的商品
	async updateUserShop({commit}){
		const data = {
			currentPage:1,
			pageSize:1
		}
		let target = {}
		let {data:fabu} = await getUserfabu(data)
		if(fabu.msg!=='success'){
			uni.showToast({
				title:fabu.msg,
				icon:"error"
			})
			return
		}
		target['fabu'] = fabu.data.total
		let {data:sell} = await getUserSell(data)
		if(sell.msg!=='success'){
			uni.showToast({
				title:sell.msg,
				icon:"error"
			})
			return
		}
		target['sell'] = sell.data.total
		let {data:buy} = await getUserBuy(data)
		if(buy.msg!=='success'){
			uni.showToast({
				title:buy.msg,
				icon:"error"
			})
			return
		}
		target['buy'] = buy.data.total
		commit('saveUserShop',target)
	}
}
const getters = {
}

export default{
	namespaced:true,
	state,
	mutations,
	actions,
	getters
}