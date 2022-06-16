import $http from "./request.js"

//发布商品
export function pushGoods(data){
   return $http.post('/product/publishInit',data)
}

//商品详情
export function goodsList(){
   return $http.post('/product/categoryPage',{categoryId:0})
}

//获取分类信息
export const getCategory = ()=>{
	return $http.get('/category/findAll')
}