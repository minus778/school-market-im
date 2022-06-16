// 1. 引入网络请求的包
import {$http} from '@escook/request-miniprogram'
import {loginto} from '../utils/login.js'
$http.baseUrl = 'https://jishi.yixun.club'
// 2.请求拦截
let reqUrl =''
$http.beforeRequest = function(options){
  reqUrl = options.url
  if(reqUrl.indexOf('/product/undercarriage')=== -1&&reqUrl.indexOf('/product/publishInit')=== -1&&reqUrl.indexOf('/product/published')=== -1&&reqUrl.indexOf('/product/sold')=== -1&&reqUrl.indexOf('/product/bought')=== -1){
	  console.log(121212)
	  // 显示加载提示
	  uni.showLoading({
	    title:'数据加载中...'
	  })
  }else{
	  console.log(55555)
  }
  // //所有请求请求头
  // options.header = {
  //   'Content-Type': 'application/json',
  // }
  //只要不是登录请求请求头都带上token

  if (options.url.indexOf('/api/login') === -1) {
	  //如果没有token就登录获取token
	  if(!uni.getStorageSync('login-token')){
		  console.log('没有token，重新获取token')
		  loginto().then(item=>{
			  options.header.token = uni.getStorageSync('login-token')
			  return options
		  }).catch(err=>console.log('错误：',err))
	  }else{
		  options.header.token = uni.getStorageSync('login-token')
		  return options
	  }
  }
}

// 3.响应拦截
$http.afterRequest = function(res){
   // 隐藏加载提示
    uni.hideLoading() 
   return res.data 
}

export default $http