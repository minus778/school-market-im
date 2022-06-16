<template>
  <view class="home-box2" v-if="goodList.length">
    <view class="left-img">
      <block v-for="(item,i) in goodList" :key="i" v-if="i%2==0">
        <view class="home-box-item" @click="toDetail(item.id,item.userId)" v-if="item.photo.split(',')[1] != 'n'">
          <view class="pic" :class="[item.photo.split(',')[1] == 'h' ? 'hd':'wd']">
            <image :src="item.photo.split(',')[0]" mode="aspectFill"></image>
          </view>
          <view class="box-item-info">
            <view class="box-item-info1">
              <view class="left">{{item.name}}</view>
              <view class="right">￥{{item.price}}</view>
            </view>
            <view class="box-item-info2">
              <view class="text">{{item.info}}</view>
            </view>
          </view>
        </view>
      </block>
    </view>
    <view class="right-img">
      <block v-for="(item,i) in goodList" :key="i" v-if="i%2!==0">
        <view class="home-box-item" @click="toDetail(item.id,item.userId)" v-if="item.photo.split(',')[1] != 'n'">
          <view class="pic" :class="[item.photo.split(',')[1] == 'h' ? 'hd':'wd']">
            <image :src="item.photo.split(',')[0]" mode="aspectFill"></image>
          </view>
          <view class="box-item-info">
            <view class="box-item-info1">
              <view class="left">{{item.name}}</view>
              <view class="right">￥{{item.price}}</view>
            </view>
            <view class="box-item-info2">
              <view class="text">{{item.info}}</view>
            </view>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
  export default {
    name: "GoodsList",
    props: {
      goodList: {
        type: Array,
        default: () => []
      }
    },
    watch:{
      goodList(value){
      }
    },
    methods: {
      toDetail(productId, userId) {
        uni.navigateTo({
          url: `/subpkg/detail/detail?productId=${productId}&userId=${userId}`
        })
      },
    },
  }
</script>

<style lang="scss">
  .home-box2 {
    box-sizing: border-box;
    width: 100%;
    // display: flex;
    // flex-wrap: wrap;
    // column-count: 2;
    // column-gap: 26rpx;
    // column-fill: aoto;
    padding-bottom: 115rpx;
    display: flex;
    justify-content: space-around;

    .left-img,
    .right-img {
      width: 337.2rpx;

      .home-box-item {
        break-inside: avoid;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 337.2rpx;
        background-color: #FFFFFF;
        border-radius: 20rpx;
        margin-bottom: 18rpx;

        image {
          width: 336rpx;
          border-radius: 20rpx 20rpx 0 0
        }

        .wd {
          image {
            height: 252rpx;
          }
        }

        .hd {
          image {
            height: 336rpx;
          }
        }

        .box-item-info {
          width: 100%;
          height: 102.4rpx;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 4rpx;
          padding-bottom: 20rpx;

          .box-item-info1 {
            padding-bottom: 8rpx;
            display: flex;
            width: 300rpx;
            justify-content: space-between;

            .left {
              width: 192rpx;
               height: 38.4rpx;
              font-size: 29.34rpx;
              font-family: AlibabaPuHuiTi-Regular;
              color: #000000;
              overflow: hidden;
              /*超出部分隐藏*/
              white-space: nowrap;
              /*不换行*/
              text-overflow: ellipsis;
              /*超出部分文字以...显示*/
            }

            .right {
              display: flex;
              flex-direction: row-reverse;
              width: 108rpx;
              height: 38.4rpx;
              overflow: hidden;
              /*超出部分隐藏*/
              white-space: nowrap;
              /*不换行*/
              text-overflow: ellipsis;
              /*超出部分文字以...显示*/
              font-size: 29.34rpx;
              color: #FF0000;
              font-family: AlibabaPuHuiTi-Regular;
            }
          }

          .box-item-info2 {
            width: 300rpx;
            height: 32rpx;
            .text {
              display: block;
              width: 300rpx; //宽度一定要有，具体根据自己需求
              height: 32rpx;
              overflow: hidden;
              /*超出部分隐藏*/
              white-space: nowrap;
              /*不换行*/
              text-overflow: ellipsis;
              /*超出部分文字以...显示*/
              font-size: 25.34rpx;
              color: #848484;

            }
          }
        }
      }
    }
  }
</style>
