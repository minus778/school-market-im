<template>
	<view class="tabbar">
		<view class="item" v-for="(item,i) in list" :key="i" @click="switchTo(item)">
			<view :class="{side:item.text,mid:!item.text}">
				<image :src="currentIndex===i?item.selectedIconPath:item.iconPath" mode="widthFix" class="img"></image>
			</view>
			<text v-if="item.text" :class="{active:currentIndex===i}" class="text">{{item.text}}</text>
		</view>
		<view class="mid-circle"></view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		name:"tabbar",
		computed:{
			...mapState('user',['userInfo'])
		},
		props:{
			list:{
				type:Array,
				default:()=>[
				  {
					"pagePath": "/pages/home/home",
					"text": "棣栭〉",
					"iconPath": "../../static/images/home.png",
					"selectedIconPath": "../../static/images/home-active.png"
				
				  },
				  {
					"pagePath": "/subpkg/fabu/fabu",
					"iconPath": "../../static/images/icon.png",
					"selectedIconPath": "../../static/images/icon.png"
				  },
				  {
					"pagePath": "/pages/my/my",
					"text": "鎴戠殑",
					"iconPath": "../../static/images/my.png",
					"selectedIconPath": "../../static/images/my-active.png"
				  }
				]
			},
			currentIndex:{
				type:Number,
				default:0
			}
		
		},
		data() {
			return {
			};
		},
		methods:{
			switchTo(item){
				//进入发布页需要登录为正式用户
				if(item.pagePath === '/subpkg/fabu/fabu'){
					if(!this.userInfo.nickname&&!this.userInfo.image){
						uni.showToast({
						  title: '未登录，请先登录',
						  icon: "none"
						})
						uni.navigateTo({
							url:'/subpkg/login/login'
						})
					}else{
						uni.navigateTo({
							url:'/subpkg/fabu/fabu'
						})
					}
				}else{
					uni.switchTab({
						url:item.pagePath
					})
				}
			}
		}
	}
</script>

<style lang="scss">
.tabbar{
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: white;
	font-size: 26rpx;
	height: 115.3rpx;
	color: #9FA0A0;
	z-index: 99;
	.item{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		.active{
			color: black;
		}
		.mid{
			position: absolute;
			top: 0;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			overflow: hidden;
			text-align: center;
			.img{
				width: 100%;
				position: relative;
			}
			
		}
		.side{
			width: 44rpx;
			height: 44rpx;
			.img{
				width: 100%;
				height: 100%;
			}
		}
		.text{
			line-height: 44rpx;
		}
	}
	.mid-circle{
		width: 138rpx;
		height: 138rpx;
		border-radius: 50%;
		background-color: white;
		position: absolute;
		top: -24rpx;
		z-index: -1;
	}
}
</style>
