import $http from "./request.js"

//登录小程序
export function login(code){
   return $http.post('/api/login',{code, system_type:"minipro"})
}

//登录网页
export function loginH5(code){
  console.log(code)
   return $http.post('/api/login',{code, system_type:"wxweb"})
}

//保存用户信息
export const saveUserInfo = (data)=>{
	return $http.post('/user/save',data)
}

// 获取学校列表
export function getSchoolList(){
	return $http.get('/api/getSchoolList')
}

//修改用户信息
export const updateUserInfo = (data)=>{
	return $http.post('/user/update',data)
}

//本人浏览商品详情页
export const myDetailInfo = (data)=>{
	return $http.get('/product/detailBySelf',data)
}

//他人浏览商品详情页
export const otherDetailInfo = (data)=>{
	return $http.get('/product/detail',data)
}
//获取用户的信息
export const getUserInfo = (data)=>{
	return $http.get('/user/info',data)
}

//获取用户发布的商品
export const getUserfabu = (data)=>{
	return $http.post('/product/published',data)
}
//获取用户卖出的商品
export const getUserSell = (data)=>{
	return $http.post('/product/sold',data)
}
//获取用户买到的商品
export const getUserBuy = (data)=>{
	return $http.post('/product/bought',data)
}

//下架商品
export const deleteShop = (data)=>{
	return $http.get('/product/undercarriage',data)
}