<template>
	<view class="mes">
		<!-- <view class="top">
			<view class="backhome" @click="backhome">
				<image src="../../static/images/back-home.png"></image>
			</view>
			<text>聊天消息</text>
		</view> -->
		<view class="info">
			<view class="info-item" v-for="(item,i) in mesList" :key="i" @click="toChat(item.userId)">
				<view class="left">
					<view class="tx">
						<image :src="item.avatar"></image>
					</view>
					<view class="text">
						<text class="name">{{item.name}}</text>
						<text class="message">{{item.mes}}</text>
					</view>
				</view>
				<view class="num" v-if="item.num!==0">
					<text>{{item.num}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mesList:[]
			};
		},
		onShow(){
			this.mesList = []
			//创建SDK实例
			let tim = this.$TIM.create({SDKAppID: this.$SDKAppID});
			this.tim = tim
			this.getMesList()
		},
		methods:{
			backhome(){
				uni.switchTab({
					url:"/pages/home/home"
				})
			},
			toChat(id){
				uni.navigateTo({
					url:`/subpkg/chat/chat?sellerId=${id}`
				})
			},
			getMesList(fn){
				// 拉取会话列表
				let promise = this.tim.getConversationList();
				promise.then((imResponse)=>{
					console.log(imResponse.data.conversationList)
				  imResponse.data.conversationList.forEach((item)=>{
					  this.mesList.push({
						  userId:item.userProfile.userID,
						  name:item.userProfile.nick,
						  mes:item.lastMessage.messageForShow,
						  avatar:item.userProfile.avatar,
						  num:item.unreadCount
					  })
				  })
				  //关闭下拉刷新
				  fn&&fn()
				}).catch((imError)=>{
				  console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
				});
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.mesList = []
			this.getMesList(uni.stopPullDownRefresh)
		}
	}
</script>

<style lang="scss">
.mes{
	.top{
		position: relative;
		padding: 110rpx 30rpx 30rpx;
		text-align: center;
		.backhome{
			position: absolute;
			top: 106rpx;
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			background-color: white;
			overflow: hidden;
			image{
				position: absolute;
				left: 50%;
				top: 50%;
				width: 70%;
				height: 70%;
				transform: translateY(-50%) translateX(-50%);
			}
		}
		
	}
	.info{
		padding:20rpx;
		.info-item{
			padding: 28rpx 24rpx;
			margin-bottom: 20rpx;
			background-color: white;
			border-radius: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.tx{
					width: 80rpx;
					height: 80rpx;
					margin-right: 20rpx;
					overflow: hidden;
					border-radius: 10rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.text{
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					.message{
						display: block;
						      max-width: 400rpx;
						      white-space: nowrap;
						      overflow: hidden;
						      text-overflow: ellipsis;
						      color: #CFCFCF;
					}
				}
			}
			.num{
				width: 32rpx;
				height: 32rpx;
				text-align: center;
				line-height: 32rpx;
				background-color: red;
				border-radius: 50%;
				color: white;
				font-size: 24rpx;
				margin-right: 20rpx;
			}
		}
	}
}
</style>
