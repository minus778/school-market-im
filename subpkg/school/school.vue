<template>
  <view class="school">
    <topnav target="school" title="选择学校"></topnav>
    <view class="circle">
      <view class="left">
      </view>
    </view>
    <view class="school-info">
      <input type="text" v-model="shoolName" placeholder="输入学校全名搜索"  maxlength="11"
        placeholder-style="font-size:30rpx;color:#000000;" />
      <view @click="gotoSearch">
        <uni-icons type="search" size="19"></uni-icons>
      </view>
    </view>

    <view class="choice-box">
      <scroll-view scroll-y="true" class="scroll">
        <view class="choice-item" v-for="(item,index) in searchList" :key="index" @click="choiceSchool(item)">
          <view class="left">
            {{item.name}}
          </view>
          <view class="right">
            <uni-icons type="right" size="19" color="#8D96AA"></uni-icons>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="fabu-btn" @click="goTo">
      <text>进入校园集市</text>
    </view>
  </view>
</template>

<script>
  import {
    getSchoolList
  } from "../../network/school.js"
  import {
    mapMutations
  } from 'vuex'
  export default {
    name: "school",
    data() {
      return {
        shoolName: '',
        searchList: [],
        timer: null
      }
    },
    methods: {
      ...mapMutations('user', ['saveUserSchool']),
      // 获取学校列表
      async getSchoolrRequest(key=this.shoolName, num= 20) {
        const {
          data: res
        } = await getSchoolList(key,num)
        this.searchList = Object.freeze(res.data)
        console.log(this.searchList)
      },
      // getSchoolrRequest(key = this.shoolName) {
      //   uni.request({
      //     url: 'http://fh88th.natappfree.cc/api/getSchoolList',
      //     data: {
      //       key:"湖南",
      //       num: 10
      //     },
      //     header: {
      //       // 'System': 'mflt',
      //       "token": uni.getStorageSync('login-token')
      //     },
      //     success: (res) => {
      //       // console.log(res.data);
      //       this.searchList = res.data.data
      //       console.log(res.data.data)
      //     }
      //   })
      // },
      // 选择学校
      choiceSchool(item) {
        this.shoolName = item.name
        this.saveUserSchool(item)
      },
      // 进入校园集市
      goTo() {
        uni.switchTab({
          url: '/pages/home/home'
        })
      }
    },
    watch: {
      shoolName(value) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getSchoolrRequest()
        }, 1000)
      },
    },
    onLoad() {
      this.getSchoolrRequest("湖南")
    }
  }
</script>
<style scoped lang="scss">
  .school {

    .school-info {
      position: relative;
      top: -103rpx;
      z-index: 3;
      width: 686rpx;
      height: 110rpx;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 20rpx;
      padding: 0 36rpx;
      line-height: 110rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      input {
        height: 110rpx;
        font-family: AlibabaPuHuiTi-Regular;
        font-size: 30rpx;
        color: #000000;
      }
    }

    .circle {
      width: 100%;
      height: 50rpx;
      position: relative;
      top: -25rpx;
      z-index: 2;
      display: flex;

      .left {
        width: 100%;
        background-color: #FF7300;
        border-radius: 0 0 50% 50%;
      }
    }

    .choice-box {
      width: 686rpx;
      height: 550rpx;
      margin: 0 auto;
      padding: 0 36rpx;
      box-sizing: border-box;
      background-color: #FFFFFF;
      border-radius: 20rpx;
      position: relative;
      top: -64rpx;

      .scroll {
        height: 550rpx;
      }

      .choice-item {
        width: 100%;
        height: 110rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2rpx solid #efefef;

        .left {
          font-size: 30rpx;
          font-family: AlibabaPuHuiTi-Medium;
          color: #8D96AA;
        }

      }
    }

    .fabu-btn {
      width: 485.34rpx;
      height: 80rpx;
      position: absolute;
      left: 50%;
      bottom: 120rpx;
      transform: translateX(-50%);
      border-radius: 40rpx;
      background-color: #FF7300;
      text-align: center;
      font-size: 34.56rpx;
      font-family: AlibabaPuHuiTi-Regular;
      line-height: 80rpx;
      color: #FFFFFF;
    }
  }
</style>
