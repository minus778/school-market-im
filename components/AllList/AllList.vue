<template>
  <view class="home-box1" v-if="AllList.length">
    <block v-for="(item,index) in AllList" :key="index">
      <view class="home-box-item" @click="gotocurrent(item.id,item.info,item.name)">
        <view class="pic">
          <image src="../../static/images/1x/0.png" mode="" v-show="index == 0"></image>
          <image src="../../static/images/1x/1.png" mode="" v-show="index == 1"></image>
          <image src="../../static/images/1x/2.png" mode="" v-show="index == 2"></image>
          <image src="../../static/images/1x/3.png" mode="" v-show="index == 3"></image>
          <image src="../../static/images/1x/4.png" mode="" v-show="index == 4"></image>
          <image src="../../static/images/1x/5.png" mode="" v-show="index == 5"></image>
          <image src="../../static/images/1x/6.png" mode="" v-show="index == 6"></image>
          <image src="../../static/images/1x/7.png" mode="" v-show="index == 7"></image>
        </view>
        <text>{{item.name}}</text>
      </view>
    </block>
  </view>
</template>

<script>
  export default {
    name: "AllList",
    data() {
      return {

      };
    },
    props: {
      AllList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods: {
      gotocurrent(id, info, name) {
        uni.navigateTo({
          url: `/subpkg/currentGoods/currentGoods?id=${id}&info=${info}&name=${name}`
        })
      }
    }
  }
</script>

<style lang="scss">
  .home-box1 {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background-color: #FFFFFF;
    padding-top: 30rpx;
    padding-left: 46rpx;
    box-sizing: border-box;
    margin-bottom: 24rpx;
    border-radius: 20rpx;

    .home-box-item {
      width: 103.68rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-right: 25rpx;

      // padding: 0 19px 17.33px 0;
      .pic {
        width: 93.68rpx;
        height: 93.68rpx;
        border-radius: 6.66rpx;

        // background-color: #BFBFBF;
        image {
          width: 93.68rpx;
          height: 93.68rpx;
        }
      }

      text {
        margin-top: 10rpx;
        margin-bottom: 30rpx;
        font-size: 25.34rpx;
        color: #191919;
        white-space: nowrap;
        font-family: AlibabaPuHuiTi-Regular;
      }
    }
  }
</style>
