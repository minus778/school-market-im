<template>
  <view class="container">
    <topnav target="login" title="登录"></topnav>
    <view class="circle"></view>
    <view class="info">
      <view class="nav">
        <text>您的性别是？</text>
        <view class="choose">
          <view
            class="choose-item"
            :class="{
              active: currentIndex === 1,
              notactive: currentIndex !== 1,
            }"
            @click="changeIndex(1)"
          >
            <view class="choose-img">
              <image src="../../static/images/boy.png"></image>
            </view>
            <text>男生</text>
          </view>
          <view
            class="choose-item"
            :class="{
              active: currentIndex === 0,
              notactive: currentIndex !== 0,
            }"
            @click="changeIndex(0)"
          >
            <view class="choose-img">
              <image src="../../static/images/girl.png"></image>
            </view>
            <text>女生</text>
          </view>
        </view>
      </view>
      <view class="chart">
        <text class="message">设置联系方式</text>
        <!-- <view class="chart-item">
					<text>QQ:</text>
					<input v-model="qq" placeholder="请输入qq号"/>
				</view>
				<view class="chart-item">
					<text>微信:</text>
					<input v-model="weChart" placeholder="请输入微信号"/>
				</view> -->
        <view class="chart-item">
          <text>手机号:</text>
          <input v-model="phone" placeholder="请输入手机号" />
        </view>
      </view>
      <view class="mes">
        <text class="message" @click="addtx">设置头像资料</text>
        <view class="tx" v-if="currentIndex != -1">
          <image :src="image"></image>
        </view>
        <uni-icons
          type="forward"
          size="17"
          color="#ADADAD"
          class="icons"
        ></uni-icons>
      </view>
    </view>
    <ClickButton
      title="进入校园集市"
      @clickto="into"
      class="button"
    ></ClickButton>
  </view>
</template>

<script>
import { saveUserInfo, getUserInfo } from "../../network/index.js";
import { loginto } from "../../utils/login.js";
import { mapMutations } from "vuex";
import { isPhone } from "../../utils/validate.js";
import {
    genTestUserSig
  } from '../../debug/GenerateTestUserSig.js'
export default {
  data() {
    return {
      currentIndex: -1,
      nickname: "",
      image: "",
      // qq:"",
      // weChart:"",
      phone: "",
    };
  },
  methods: {
    ...mapMutations("user", ["updateInfo"]),
    changeIndex(index) {
      this.currentIndex = index;
      if (this.currentIndex === 1) {
        this.image = "../../static/images/boy.png";
      } else {
        this.image = "../../static/images/girl.png";
      }
    },
    async into() {
      if (this.currentIndex === 1) {
        this.nickname = "某男生";
      }
      if (this.currentIndex === 0) {
        this.nickname = "某女生";
      }
      if (this.currentIndex === -1) {
        uni.showToast({
          title: "请先选择性别",
          icon: "none", //图标
        });
        return false;
      }
      if (this.phone) {
        let res = isPhone(this.phone);
        if (!res) {
          uni.showToast({
            title: "请输入11位正确格式的手机号",
            icon: "none", //图标
          });
          return false;
        }
      }
      const data = {
        gender: this.currentIndex,
        nickname: this.nickname,
        image: this.image,
        // qq:this.qq,
        // weChart:this.weChart,
        phone: this.phone,
      };
      let res = await saveUserInfo(data);
      //更新用户信息成功
      if (res.data.msg === "success") {
        console.log("正式用户登录成功");
        //重新获取用户信息更新仓库
        let { data } = await getUserInfo();
        this.updateInfo(data.data);
		//跳转到首页
		uni.switchTab({
		  url: "/pages/home/home",
		});
		//登录即时通讯
		this.imLogin(data.data)
		// //创建SDK实例
		// let tim = this.$TIM.create({SDKAppID: this.$SDKAppID});
		// //保存用户信息
		// tim.updateMyProfile({
		// 	nick:data.data.nickname,
		// 	avatar:data.data.image,
		// 	gender:data.data.gender===1?this.$TIM.TYPES.GENDER_MALE:this.$TIM.TYPES.GENDER_FEMALE
		// });
		
        
      }else{
		  uni.showToast({
		  	title:res.data.msg,
			icon:"error"
		  })
	  }
    },
    //设置头像
    addtx() {
      //回调函数的箭头指向问题导致回调函数的this指向的不是vue组件，定义that将组件的this保存下来
      const that = this;
      //从本地选择图片
      uni.chooseImage({
        count: 1,
        success(res) {
          const images = res.tempFilePaths;
          //图片选择完成,发请求将图片上传到服务器
          images.forEach((image) => {
            uni.uploadFile({
              url: "https://mfxy.tanghaolun.cn/api/v1/common/upload",
              filePath: image,
              name: "file",
              formData: {
                type: 1,
                img_type: "dynamic",
              },
              success(mes) {
                const data = JSON.parse(mes.data);
                //图片上传出错
                if (data.errNo != 0) {
                  uni.showToast({
                    title: data.errstr,
                    icon: "error",
                  });
                  return;
                }
                //图片上传成功返回图片，将头像信息展示保存在个人信息页面，如果点击保存，再保存到仓库
                that.image = data.data;
              },
            });
          });
        },
      });
    },
	//即时通讯登录(当前用户上线即时通讯)
	imLogin(info){
		const userId = String(info.id)
		let tim = this.$TIM.create({SDKAppID: this.$SDKAppID}); // SDK 实例通常用 tim 表示
		tim.setLogLevel(1); // 普通级别，日志量较多，接入时建议使用
		tim.registerPlugin({'tim-upload-plugin': this.$TIMUploadPlugin});
	
		// 登录
		let promise = tim.login({userID: userId, userSig: genTestUserSig(userId).userSig});
		promise.then((imResponse)=>{
	
			console.log('即时通讯登录成功',imResponse.data); // 登录成功
			if (imResponse.data.repeatLogin === true) {
				 // 标识账号已登录，本次登录操作为重复登录
				 console.log('即时通讯登录成功',imResponse.data.errorInfo);
			}
		}).catch((imError)=>{
			 console.log('即时通讯login error:', imError); // 登录失败的相关信息
		});
		// 监听SDKready后调用：
		tim.on(this.$TIM.EVENT.SDK_READY, (event)=>{
		  //保存用户信息
		  tim.updateMyProfile({
		  	nick:info.nickname,
		  	avatar:info.image,
		  	gender:info.gender===1?this.$TIM.TYPES.GENDER_MALE:this.$TIM.TYPES.GENDER_FEMALE
		  });
		});
	}
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  background-color: #faf7fa;

  .info {
    position: relative;
    top: -120rpx;
    padding: 0 38rpx;
    z-index: 3;
    .chart {
      background-color: white;
      border-radius: 26.66rpx;
      margin-bottom: 20rpx;
      padding: 16rpx 35.3rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .chart-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10rpx 0 0;

        input {
          width: 460rpx;
          height: 40rpx;
          padding: 10rpx;
        }
      }
    }
    .nav {
      background-color: white;
      border-radius: 26.66rpx;
      margin-bottom: 20rpx;
      padding: 16rpx 35.3rpx;
      .choose {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .active {
          border: 4rpx solid #ff7300;
        }
        .notactive {
          border: 4rpx solid #d4d2d6;
        }
        .choose-item {
          border-radius: 20rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          height: 150rpx;
          width: 140rpx;
          padding: 10rpx;
          margin-top: 20rpx;
          .choose-img {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            overflow: hidden;
            image {
              width: 100%;
              height: 100%;
            }
          }
          text {
            font-size: 26rpx;
          }
        }
      }
    }
    .mes {
      background-color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 113rpx;
      border-radius: 26.66rpx;
      margin-bottom: 20rpx;
      padding: 0 35.3rpx;
      .tx {
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
        overflow: hidden;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .message {
        flex: 1;
        margin-left: 12.66rpx;
        font-size: 31.5rpx;
      }
      .icons {
        font-weight: 700;
      }
      input {
        width: 390rpx;
        background-color: #faf7fa;
        border-radius: 70rpx;
        padding: 16rpx 20rpx;
      }
    }
  }
  .circle {
    width: 100%;
    height: 50rpx;
    position: relative;
    top: -25rpx;
    border-radius: 0 0 50% 50%;
    background-color: #ff7403;
    z-index: 2;
  }
}
</style>
