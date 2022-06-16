<template>
  <view class="container" v-if="productInfo">
    <!-- <TopTitle title="详情" @back="back" iconsIsShow="true" class="detailtop"></TopTitle> -->
    <text class="goodname">{{productInfo.name}}</text>
    <view class="br"></view>
    <view class="info">
      <text class="info-text">{{productInfo.info}}</text>
      <!-- 图片实现瀑布图效果 -->
      <Images :imagesList="list2" v-if="productInfo.photo"></Images>
    </view>
    <view class="footer">
      <text class="price"><text v-if="productInfo.price">￥{{productInfo.price}}</text></text>
      <text class="button" @click="want" v-if="String(sellerId)!==String(userInfo.id)">我想要</text>
	  <text class="button" @click="deleteshop" v-else>下架商品</text>
    </view>
  </view>
</template>

<script>
  import {
    loginto
  } from '../../utils/login.js'
  import {
    mapState,mapActions
  } from 'vuex'
  import {
    myDetailInfo,
    otherDetailInfo,
	deleteShop
  } from '../../network/index.js'
  export default {
    data() {
      return {
        productInfo: {},
        list2: [],
        num:0,
		sellerId:null
      };
    },
    methods: {
		...mapActions('user',['updateUserShop']),
      back() {
        uni.switchTab({
          url: "/pages/home/home"
        })
      },
      async getProductInfo(userId, productId) {
        //判断当前商品是否是本人发布的商品->判断userid和仓库存储的用户id是否一致
        const data = {
          id: productId
        }
        if (this.userInfo.id === userId) {
          //本人浏览商品
          let {
            data: res
          } = await myDetailInfo(data)
          console.log('本人浏览', res.data)
          this.productInfo = res.data
        } else {
          //他人浏览商品
          let {
            data: res
          } = await otherDetailInfo(data)
          console.log('他人浏览', res.data)
          this.productInfo = res.data
        }
      },
      want() {
        //测试登录效果->正式用户才能登录到详情页
        if (!this.userInfo.nickname&&!this.userInfo.image) {
          uni.showToast({
            title: '未登录，请先登录',
            icon: "none"
          })
          uni.navigateTo({
            url: "/subpkg/login/login"
          })

        } else {
          //进入聊天页
		  uni.navigateTo({
		  	url:`/subpkg/chat/chat?sellerId=${this.sellerId}`
		  })
        }
      },
	  async deleteshop(){
		  let res = await deleteShop({id:this.productInfo.id})
		  if(res.data.msg==='success'){
			 
			  //下架商品成功重新更新仓库用户商品信息
			  this.updateUserShop();
			  uni.showToast({
			  	title:'下架成功',
			  	icon:"none"
			  })
			  setTimeout(()=>{
				  uni.switchTab({
				  	url:'/pages/home/home'
				  })
			  },500)
		  }else{
			  uni.showToast({
			  	title:res.data.msg,
			  	icon:"error"
			  })
		  }
	  }
    },
    computed: {
      ...mapState('user', ['userInfo']),
    },
    watch: {
      //判断图片宽高
      productInfo(value) {
        let list = value.photo.split(',')
        const that = this
        let num = list.length 
        while(num-- > 0){
          this.list2.push(1)
        }
        list.forEach((item, index) => {
            uni.getImageInfo({
                src: item,
                success: function(image) {
                  // console.log("上传的图片宽度",image.width);
                  // console.log("上传的图片的高度",image.height);
                  if (image.width > image.height) {
                    // if()
                    that.list2.splice(index, 1, item + ',w')
                  } else {
                    that.list2.splice(index, 1, item + ',h')
                  }
                  }
                })
            }) 
            // console.log("this.list2",this.list2)
        }
      },

      onLoad(options) {
		  //卖家id
		  this.sellerId = options.userId
        //接收传递过来的userid和productid,发请求获取商品详情
        this.getProductInfo(options.userId, options.productId)
        //this.getProductInfo(546,10)

      }
    }
</script>

<style lang="scss" scoped>
  .container {
    padding: 20rpx;
    background-color: #FFFFFF;
    user-select: text;

    .detailtop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 120rpx;
      padding-top: 30rpx;
      z-index: 9999;

      background-color: white::v-deep.icons {
        left: 20rpx;
      }
    }

    .goodname {
      font-size: 34rpx;
      font-weight: 700;
    }

    .br {
      height: 4rpx;
      background-color: #f7f7f9;
      width: 90%;
      margin: 20rpx auto;
    }

    .info {
      .info-text {
        font-size: 32rpx;
      }
    }

    .footer {
      user-select: none;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 132rpx;
      box-shadow: 0 -10rpx 10rpx #f8f8f8;
      background-color: white;
      z-index: 99;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30rpx;

      .button {
        border-radius: 40rpx;
        background-color: #ff7402;
        color: white;
        font-size: 32rpx;
        align-items: center;
        padding: 16rpx 62rpx;
        font-weight: 700;
      }

      .price {
        color: #FF0000;
        font-weight: 700;
        font-size: 40rpx;
      }
    }
  }
</style>
