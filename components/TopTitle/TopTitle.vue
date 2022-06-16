<template>
  <view class="top-title" :class="{topFixd:title === '校园集市' || isFixd}">
    <uni-icons type="back" size="20" class="icons" :color='color' @click="back" v-show="iconsIsShow"></uni-icons>
    <text :style="{color:color}">{{title}}</text>
  </view>
</template>

<script>
  export default {
    name: "TopTitle",
    data() {
      return {

      };
    },
    props: {
      title: {
        type: String
      },
      color: {
        type: String,
        default: "black"
      },
      iconsIsShow: {
        type: Boolean,
        default: () => false
      },
      isFixd:{
        type:Boolean,
        default:false
      },
    },
    methods: {
      back() {
        this.$emit('back')
      }
    }
  }
</script>

<style scoped lang="scss">
  .top-title {
    width: 100%;
    height: 180rpx;
    font-size: 36rpx;
    padding: 26rpx 0;
    box-sizing: border-box;
    position: relative;

    .icons {
      position: absolute;
      top: 50%;
      left: -13rpx;
      font-weight: 700;
      transform: translateY(-40%);
    }

    text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .topFixd {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #f5f5f5;
    height: 180rpx;
	z-index: 999;
    text {
      text-align: center;
      padding-top: 50rpx;
    }
    .icons{
          position: absolute;
          top: 50%;
          left: 13rpx;
          font-weight: 700;
          transform: translateY(16%);
    }
  }
</style>
