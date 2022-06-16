<template>
	<view class="container">
    <topnav target="my" title="我的" isback="false"></topnav>
		<view class="circle"></view>
		<view class="info">
			<view class="nav">
				<view class="nav-item" @click="toGoodsList('我发布的')">
					<text class="num">{{userShop.fabu}}</text>
					<text class="text">我发布的</text>
				</view>
				<view class="nav-item" @click="toGoodsList('我卖出的')">
					<text class="num">{{userShop.sell}}</text>
					<text class="text">我卖出的</text>
				</view>
				<view class="nav-item" @click="toGoodsList('我买到的')">
					<text class="num">{{userShop.buy}}</text>
					<text class="text">我买到的</text>
				</view>
			</view>
			<view class="mes">
				<view class="mes-item" @click="toMes">
					<image src="../../static/images/icon2.png"></image>
					<text class="message">消息</text>
					<uni-icons type="forward" size="17" color='#ADADAD' class="icons"></uni-icons>
				</view>
				<view class="mes-item" @click="toWeb">
					<image src="../../static/images/icon2.png"></image>
					<text class="message">客服反馈</text>
					<uni-icons type="forward" size="17" color='#ADADAD' class="icons"></uni-icons>
				</view>
			</view>
		</view>
		<tabbar :currentIndex="selected"></tabbar>
	</view>
</template>

<script>
	import {mapActions,mapState} from 'vuex'
	export default {
		data() {
			return {
				selected:2,
				fabuNum:'',
				buyNum:'',
				sellNum:''
			};
		},
		onLoad() {
			uni.hideTabBar()
			//发请求获取用户商品信息
			this.updateUserShop()
		},
		methods:{
			...mapActions('user',['updateUserShop']),
			toMes(){
				if(this.userInfo.nickname&&this.userInfo.image){
					uni.navigateTo({
						url:'/subpkg/message/message'
					})
				}else{
					uni.showToast({
						title:'请先登录',
						icon:'none'
					})
					uni.navigateTo({
						url:'/subpkg/login/login'
					})
				}
			},
			toGoodsList(name){
				uni.navigateTo({
				  url:`/subpkg/currentGoods/currentGoods?id=-1&name=${name}`
				})
			},
			toWeb(){
				// uni.navigateTo({
				// 	url:'/subpkg/webView/webView?url=https://work.weixin.qq.com/kfid/kfc82cc5827fcd1c570'
				// })
        window.location.href = 'https://work.weixin.qq.com/kfid/kfc82cc5827fcd1c570'
			}
		},
		computed:{
			...mapState('user',['userShop','userInfo'])
		}
	}
</script>

<style lang="scss" scoped>
.container{
	width: 100%;
	height: 100vh;
	background-color: #FAF7FA;

	.info{
		position: relative;
		top: -80rpx;
		padding: 0 38rpx;
		z-index: 3;
		.nav{
			height: 161.34rpx;
			background-color: white;
			display: flex;
			justify-content: space-around;
			align-items: center;
			border-radius: 26.66rpx;
			margin-bottom: 20rpx;
			.nav-item{
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;
				
				.num{
					font-size: 38rpx;
					font-weight: bold;
					color: #000000;
					line-height: 44.44rpx;
				}
				.text{
					font-size: 25.2rpx;
					font-weight: Regular;
					color: #6E6E6E;
					line-height: 44.44rpx;
				}
			}
		}
		.mes{
			background-color: white;
			border-radius: 26.66rpx;
			padding: 20rpx 35.3rpx;
			.mes-item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 18rpx 0;
				image{
					width: 32rpx;
					height: 32rpx;
				}
				.message{
					flex: 1;
					margin-left: 12.66rpx;
					font-size: 31.5rpx;
				}
				.left{
					color: black;
				}
				.icons{
					font-weight: 700;
				}
			}
		}
		
	}
	.circle{
		width: 100%;
		height: 50rpx;
		position: relative;
		top: -25rpx;
		border-radius: 0 0 50% 50%;
		background-color: #FF7403;
		z-index: 2;
	}
}
</style>
