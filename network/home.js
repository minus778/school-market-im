import $http from "./request.js"

//商品分类
export function categoryAll(){
   return $http.get('/category/findAll')
}

//商品详情
export function goodsList(data){
   return $http.post('/product/categoryPage',data)
}

// 点击分类
export function currentGoodsList(data){
  console.log(data)
   return $http.post('/product/categoryPage',data)
}