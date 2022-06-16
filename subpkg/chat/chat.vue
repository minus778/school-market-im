<template>
	<view class="chat">
		<view class="info">
			<block v-for="(item,i) in mesList" :key="i">
				<view class="message-right" v-if="item.type==='right'">
					<view class="mes" v-if="!item.img">
						<view class="text">{{item.info}}</view>
						<view class="sanjiao"></view>
					</view>
					<image :src="item.info" v-else class="info-img" :style="{width:item.width*0.7+'px',height:item.height*0.7+'px'}"></image>
					<image :src="userInfo.image" class="tx"></image>
				</view>
				<view class="message-left" v-else>
					<image :src="sellerImg" class="tx"></image>
					<view class="mes" v-if="!item.img">
						<view class="text">{{item.info}}</view>
						<view class="sanjiao"></view>
					</view>
					<image :src="item.info" v-else class="info-img" :style="{width:item.width*0.7+'px',height:item.height*0.7+'px'}"></image>
				</view>
			</block>
		</view>
		<view class="footer">
			<input placeholder="请输入内容" v-model="message"/>
			<uni-icons custom-prefix="custom-icon" type="image-filled" size="30" class="icons" @click="chooseImg"></uni-icons>
			<text @click="submitMes">发送</text>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				//SDK实例
				tim:null,
				//卖家id，为了传达聊天信息
				sellerId:null,
				mesList:[],
				message:'',
				nextReqMessageID:null,
				isCompleted:false,
				sellerImg:"",
				sellerName:""
			};
		},
		computed:{
			//this.userInfo.id获取当前用户id
			...mapState('user',['userInfo'])
		},
		onLoad(options){
			this.sellerId = options.sellerId
			//创建SDK实例
			let tim = this.$TIM.create({SDKAppID: this.$SDKAppID});
			this.tim = tim
			//获取对方资料
			this.getUserInfo()
			//初始化时获取聊天信息列表
			this.getMesList()
			
			//监听消息接收
			this.tim.on(this.$TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived);
		},
		//页面卸载
		onUnload(){
			// 将当前会话下所有未读消息已读上报
			this.tim.setMessageRead({conversationID: `C2C${this.sellerId}`});
		},
		methods:{
			//获取用户资料
			getUserInfo(){
				let promise = this.tim.getUserProfile({
				  userIDList: [this.sellerId] // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
				});
				promise.then((imResponse)=>{
				  console.log('卖家信息',imResponse.data); // 存储用户资料的数组 - [Profile]
				  this.sellerImg = imResponse.data[0].avatar
				  this.sellerName = imResponse.data[0].nick
				  //修改标题
				  uni.setNavigationBarTitle({
				    title: this.sellerName
				  })
				}).catch((imError)=>{
				  console.warn('getUserProfile error:', imError); // 获取其他用户资料失败的相关信息
				});
			},
			//发图片
			chooseImg(){
				// 小程序端发送图片
				// 1. 选择图片
				const that = this
				uni.chooseImage({
				  sourceType: ['album'], // 从相册选择
				  count: 1, // 只选一张，目前 SDK 不支持一次发送多张图片
				  success: function (res) {
				    // 2. 创建消息实例，接口返回的实例可以上屏
				    let message = that.tim.createImageMessage({
				      to: that.sellerId,
				      conversationType: that.$TIM.TYPES.CONV_C2C,
				      payload: { file: res },
				      onProgress: (event)=>{ console.log('file uploading:', event) }
				    });
				    // 3. 发送图片
				    let promise = that.tim.sendMessage(message);
				    promise.then((imResponse)=>{
				      // 发送成功
					  //滚动到底部
					  setTimeout(() => {
					     uni.pageScrollTo({scrollTop: 99999, duration: 0});
					  }, 50);
				      console.log(imResponse);
					  const data = imResponse.data.message
					  const item = {
						  info:data.payload.imageInfoArray[1].url,
						  type:'right',
						  img:true,
						  width:data.payload.imageInfoArray[1].width,
						  height:data.payload.imageInfoArray[1].height,
					  }
					  that.mesList.push(item)
				    }).catch((imError)=>{
				      // 发送失败
				      console.warn('sendMessage error:', imError);
				    });
				  }
				})
			},
			//发消息
			submitMes(){
				// 发送文本消息，Web 端与小程序端相同
				// 1. 创建消息实例，接口返回的实例可以上屏
				let message = this.tim.createTextMessage({
				  to: this.sellerId,
				  conversationType: this.$TIM.TYPES.CONV_C2C,
				  payload: {
				    text: this.message
				  }
				});
				// 2. 发送消息
				let promise = this.tim.sendMessage(message,{
				  // 如果接收方不在线，则消息将存入漫游，且进行离线推送（在接收方 App 退后台或者进程被 kill 的情况下）。接入侧可自定义离线推送的标题及内容
				  offlinePushInfo: {
					title: '您有一条信息未查看', // 离线推送标题
					description: '您有一条信息待查看', // 离线推送内容
				  }
				});
				promise.then((imResponse)=>{
				  // 发送成功
				  //滚动到底部
				  setTimeout(() => {
				     uni.pageScrollTo({scrollTop: 99999, duration: 0});
				  }, 50);
				  this.message = ''
				  console.log('发送成功',imResponse);
				  const data = imResponse.data.message
				  const item = {
					  info:data.payload.text,
					  type:'right'
				  }
				  this.mesList.push(item)
				}).catch((imError)=>{
				  // 发送失败
				  console.warn('sendMessage error:', imError);
				});
			},
			//接收消息(监听消息接收)
			onMessageReceived(event){
				console.log('接收到消息',event.data)
				//滚动到底部
				setTimeout(() => {
				   uni.pageScrollTo({scrollTop: 99999, duration: 0});
				}, 50);
				event.data.forEach((item)=>{
					//接收文字消息
					if(item.payload.text){
						this.mesList.push({
							info:item.payload.text,
							type:"left",
						})
					}
					//接收图片消息
					if(item.payload.imageInfoArray){
						this.mesList.push({
							info:item.payload.imageInfoArray[1].url,
							type:'left',
							img:true,
							width:item.payload.imageInfoArray[1].width,
							height:item.payload.imageInfoArray[1].height,
						})
					}
				})
			},
			//获取当前会话的消息列表
			getMesList(fn){
				// 获取聊天信息
				let promises = this.tim.getMessageList({
					conversationID: 'C2C' + this.sellerId,
					nextReqMessageID: this.nextReqMessageID,
					count: 15
				});
				promises.then((imResponse) => {
					console.log(imResponse)
					let list = []
					imResponse.data.messageList.forEach((item)=>{
						//文字消息
						if(item.payload.text){
							if(item.from===String(this.userInfo.id)){
								list.push({
									info:item.payload.text,
									type:"right",
								})
							}else{
								list.push({
									info:item.payload.text,
									type:"left",
								})
							}
						}
						//图片消息
						if(item.payload.imageInfoArray){
							if(item.from===String(this.userInfo.id)){
								list.push({
									info:item.payload.imageInfoArray[1].url,
									type:'right',
									img:true,
									width:item.payload.imageInfoArray[1].width,
									height:item.payload.imageInfoArray[1].height,
								})
							}else{
								list.push({
									info:item.payload.imageInfoArray[1].url,
									type:'left',
									img:true,
									width:item.payload.imageInfoArray[1].width,
									height:item.payload.imageInfoArray[1].height,
								})
							}
						}
					})
					this.mesList = list.concat(this.mesList)
					//滚动到底部
					if(!fn){
						setTimeout(() => {
						   uni.pageScrollTo({scrollTop: 99999, duration: 0});
						}, 50);
					}
					this.nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段
					console.log('nextReqMessageID', this.nextReqMessageID)
					this.isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
					console.log('是否已经拉完所有消息', this.isCompleted)
					//结束下拉刷新
					fn&&fn()
				})
			}
		},
		//下拉加载更多聊天信息
		onPullDownRefresh() {
		  //重新发请求获取商品数据
		  if(!this.isCompleted){
			this.getMesList(uni.stopPullDownRefresh)
		  }else{
			uni.showToast({
				title:"没有更多历史消息了~",
				icon:"none"
			})
			uni.stopPullDownRefresh()
		  }
		  
		},
	}
</script>

<style lang="scss">
.chat{
	.info{
		padding-bottom: 120rpx;
		.message-right{
			display: flex;
			justify-content: flex-end;
			margin: 20rpx;
			.tx{
				width: 80rpx;
				height: 80rpx;
				border-radius: 10rpx;
				overflow: hidden;
			}
			.info-img{
				border-radius: 10rpx;
				overflow: hidden;
				margin-right: 20rpx;
			}
			.mes{
				position: relative;
				margin-right: 30rpx;
				.sanjiao{
					position: absolute;
					right: -18rpx;
					top: 30rpx;
					width: 0;
					height: 0;
					line-height: 0;
					font-size: 0;
					border: 10rpx solid transparent;
					border-left-color: #42b983;
				}
				.text{
					word-wrap: break-word;
					padding: 20rpx;
					background-color: #42b983;
					border-radius: 10rpx;
					color: white;
					max-width: 360rpx;
				}
			}
		}
		.message-left{
			display: flex;
			margin: 20rpx;
			.tx{
				width: 80rpx;
				height: 80rpx;
				border-radius: 10rpx;
				overflow: hidden;
			}
			.info-img{
				border-radius: 10rpx;
				overflow: hidden;
				margin-left: 20rpx;
			}
			.mes{
				position: relative;
				margin-left: 30rpx;
				.sanjiao{
					position: absolute;
					left: -18rpx;
					top: 30rpx;
					width: 0;
					height: 0;
					line-height: 0;
					font-size: 0;
					border: 10rpx solid transparent;
					border-right-color: #FFFFFF;
				}
				.text{
					word-wrap: break-word;
					padding: 20rpx;
					background-color: #FFFFFF;
					border-radius: 10rpx;
					max-width: 360rpx;
				}
			}
			
		}
	}
	.footer{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 20rpx;
		background-color: #efefef;
		input{
			padding: 16rpx 10rpx;
			border-radius: 8rpx;
			background-color: white;
			width:74%;
		}
		.icons{
			margin: 0 6rpx;
		}
		text{
			font-size: 30rpx;
		}
	}
}
</style>
