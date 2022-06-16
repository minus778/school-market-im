<template>
  <view class="img-container" >
    <view class="big-img" @click="previewImage(0)" v-if="imagesList[0] != 1" :class="{'is-need':imagesList[0] == 1}">
      <image :src="imagesList[0].split(',')[0]" class="imgs" mode="aspectFill"
        :class="[imagesList[0].split(',')[1] == 'h' ? 'hd':'wd']"></image>
    </view>
    <view class="small-img">
      <view class="left-img">
        <view v-for="(item,i) in imagesList" :key="i" v-if="i%2!==0&&i!==0" class="item">
          <image :src="item.split(',')[0]" mode="aspectFill" class="smallimg"
            :class="[item.split(',')[1] == 'h' ? 'hd':'wd']" @click="previewImage(i)" v-if="item != 1"></image>
        </view>
      </view>
      <view class="right-img">
        <view v-for="(item,i) in imagesList" :key="i" v-if="i%2==0&&i!==0" class="item">
          <image :src="item.split(',')[0]" mode="aspectFill" class="smallimg"
            :class="[item.split(',')[1] == 'h' ? 'hd':'wd']" @click="previewImage(i)" v-if="item != 1"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "Images",
    props: {
      imagesList: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        list: []
      };
    },
    watch: {
      imagesList(value) {
        // if(value.indexOf(1) != -1) return
        // console.log(value)
        this.list = value.map(item => {
          if (item == 1) return
          return item.split(',')[0]
        })
        // console.log("list",this.list)
      }
    },
    methods: {
      previewImage(current) {
        uni.previewImage({
          urls: this.list,
          current,
        })
      }
    },
  }
</script>

<style lang="scss">
  .img-container {
    margin-bottom: 135rpx;
    .big-img {
      width: 100%;
      border-radius: 20rpx;
      margin: 10rpx 0;
      overflow: hidden;
      .is-need{
        height: 532.8rpx;
      }
      .imgs {
        width: 100%;
      }

      .wd {
        height: 532.8rpx;
      }

      .hd {
        height: 710.4rpx;
      }
    }

    .small-img {
      display: flex;
      width: 100%;
      justify-content: space-between;

      .left-img,
      .right-img {
        display: flex;
        flex-flow: column nowrap;
        width: 49%;

        .item {
          width: 100%;
          border-radius: 20rpx;
          margin-bottom: 10rpx;
          overflow: hidden;

          .smallimg {
            width: 100%;
          }

          .hd {
            height: 348.08rpx;
          }

          .wd {
            height: 261.6rpx;
          }
        }
      }
    }
  }
</style>
