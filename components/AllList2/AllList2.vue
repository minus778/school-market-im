<template>
  <view class="home-box1">
    <view class="input">
      <input type="text" value="" placeholder="搜索你需要的"  placeholder-style="font-size:15px;color:#ccc;"/>
      <uni-icons type="search" size="22" color="#FF7300" class="icons"></uni-icons>
    </view>
    <block v-for="(item,index) in AllList" :key="index">
      <view class="home-box-item">
        <view class="pic">
        </view>
        <text>{{item.name}}</text>
      </view>
    </block>
    <view class="home-box-item">
      <view class="pic">
      </view>
      <text>哈哈哈哈哈</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"AllList",
    data() {
      return {
        
      };
    },
    props:{
      AllList:{
        type:Array,
        default(){
          return []
        }
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
      padding: 30rpx 60rpx 30rpx ;
      box-sizing: border-box;
      margin-bottom: 16.6rpx;
      border-radius: 20rpx;
      .input{
        width: 100%;
        height: 34px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        border: 2px solid #FF7300;
        border-radius: 34px;
        input{
          flex:1;
          height: 25px;
          border: 0;
        }
        .icons{
          width: 22px;
          height: 22px;
        }
      }
      
      .home-box-item {
        width: 103.68rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-right: 30rpx;
        padding-top: 30rpx;
        &:nth-of-type(5n+1){
          padding-right: 0rpx;
        }
        // padding: 0 19px 17.33px 0;
        .pic {
          width: 103.68rpx;
          height: 103.68rpx;
          border-radius: 6.66rpx;
          background-color: #BFBFBF;
        }

        text {
          margin-top: 5rpx;
          font-size: 25.34rpx;
          color: #191919;
          white-space: nowrap;
          font-family: AlibabaPuHuiTi-Regular;
        }
      }
    }
</style>
