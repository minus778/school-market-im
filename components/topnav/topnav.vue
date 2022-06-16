<template>
  <view
    class="topnav"
    :style="{ height: target == 'school' ? 400 + 'rpx' : 500 + 'rpx' }"
  >
    <view class="top">
<!--      <TopTitle
        :title="title"
        color="white"
        :iconsIsShow="target === 'login' || target === 'school'"
        @back="back"
      ></TopTitle> -->

      <view class="top-info" v-if="target === 'my'" @click="toSetUser">
        <view class="top-img">
          <image :src="userTx" class="top-imgs"></image>
        </view>
        <text class="name">{{ userName}}</text>
        <uni-icons
          type="forward"
          size="17"
          color="white"
          class="icons"
        ></uni-icons>
      </view>
      <view class="login" v-if="target === 'login'">
        <text>请先设置资料</text>
        <text class="small">设置好资料才能使用校园集市</text>
        <text class="small">让校园生活更美好</text>
      </view>
      <view class="school" v-if="target === 'school'">
        <text class="title">请先选择学校</text>
        <text class="eng">SCHOOL</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "topnav",
  data() {
    return {};
  },
  computed: {
    ...mapState("user", ["userInfo"]),
	userName(){
		return this.userInfo.nickname||'请登录'
	},
	userTx(){
		return this.userInfo.image||require('../../static/images/tx.png')
	}
  },
  props: {
    target: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    toSetUser() {
      if (
        !this.userInfo.nickname&&!this.userInfo.image
      ) {
        uni.navigateTo({
          url: "/subpkg/login/login",
        });
      } else {
        uni.navigateTo({
          url: "/subpkg/setUser/setUser",
        });
      }
    },
    back() {
      uni.switchTab({
        url: "/pages/my/my",
      });
    },
  },
};
</script>

<style lang="scss">
.topnav {
  position: relative;
  width: 100%;
  height: 320rpx;
  background-image: url(../../static/images/bg.png);
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 3;
  .top {
    padding: 180rpx 44rpx 120rpx 48rpx;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    color: white;
    .top-info {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      .top-img {
        width: 110rpx;
        height: 110rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 38rpx;
        border: 4rpx solid white;

        .top-imgs {
          width: 100%;
          height: 100%;
        }
      }
      .name {
        flex: 1;
        font-size: 44rpx;
      }
      .icons {
        font-weight: 700;
      }
    }
    .login {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-top: 30rpx;
      line-height: 50rpx;
      .small {
        font-size: 24rpx;
      }
    }
    .school {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .title {
        font-size: 46.56rpx;
        font-family: AlibabaPuHuiTi-Heavy;
        font-weight: 900;
        color: #ffffff;
      }
      .eng {
        font-size: 34rpx;
        font-family: AlibabaPuHuiTi-Regular;
        color: #ffffff;
      }
    }
  }
}
</style>
