<template>
  <view class="current">
    <!-- <TopTitle :title="name" @back="back" iconsIsShow="true" isFixd="true"></TopTitle> -->
    <GoodsList :goodList="list3"></GoodsList>
  </view>
</template>

<script>
  import {
    goodsList
  } from '../../network/home.js'
  import {
    getUserfabu,
    getUserSell,
    getUserBuy
  } from '../../network/index.js'
  import {
    countImageHome2
  } from "../../mixins"
  export default {
    data() {
      return {
        info: '',
        // List:[],
        currentPage: 1, //当前页码
        categoryId: -1, //类别id
        heat: 0, //按热度排序
        pageSize: 20, //分页商品数量
        isReq: true, //开启上拉触底节流，是否可以发请求
        data: {}, //请求参数
        res: {}, //请求返回数据
        name: '',
        isnone: false, // 上拉是否还有商品
      };

    },
    mixins: [countImageHome2],
    onLoad(option) {
      uni.setNavigationBarTitle({
        title: option.name
      })
      this.name = option.name
      this.categoryId = option.id
      if (option.info) this.info = option.info
      this.goodsListRequest()
    },
    methods: {
      async goodsListRequest(fn) {
        //首页、分类页查询商品
        if (this.categoryId != -1) {

          console.log('分类商品')
          this.data = {
            categoryId: this.categoryId,
            currentPage: this.currentPage,
            heat: this.heat,
            pageSize: this.pageSize
          }
          const {
            data: res
          } = await goodsList(this.data)
          this.res = res
        } else {
          console.log('我的商品')
          //我的页面查询发布的商品等
          this.data = {
            currentPage: this.currentPage,
            pageSize: this.pageSize
          }
          if (this.name === '我发布的') {
            const {
              data: res
            } = await getUserfabu(this.data)
            this.res = res
          }
          if (this.name === '我卖出的') {
            const {
              data: res
            } = await getUserSell(this.data)
            this.res = res
          }
          if (this.name === '我买到的') {
            const {
              data: res
            } = await getUserBuy(this.data)
            this.res = res
          }

        }
        if (this.res.data.records.length > 0) {
          // 计算高度后并添加到list3
          this.countImages(this.res.data.records)
          this.isReq = true // 关闭节流阀，下次可触发上拉加载
          console.log(this.res.data.records)
          // console.log("lll")
        } else {
          // console.log("222")
          //1.如果请求回来没有数据了，使提示没有更多商品了,节流阀不用关，因为没必要再发请求了
          uni.showToast({
            title: '没有更多商品了',
            icon: 'none'
          })
          this.isnone = true //没有商品了，再次上拉触底时，触发提示
        }
        //请求结束关闭下拉
        fn&&fn()
      },
    },
    //上拉触底
    onReachBottom() {
      if (this.isnone && this.currentPage * this.pageSize > this.list3.length) {
        uni.showToast({
          title: '没有更多商品了',
          icon: 'none'
        })
        return
      }
      if (this.isReq) {
        //开启节流阀
        this.isReq = false
        this.currentPage++
        this.goodsListRequest()
      }
    },
    //下拉刷新
    onPullDownRefresh() {
      //重置数据
      this.currentPage = 1
      this.list3 = []
      this.isReq = true
      this.isnone = false
      //重新发请求获取商品数据
      this.goodsListRequest(uni.stopPullDownRefresh)
    },
  }
</script>

<style lang="scss">
  .current {
    width: 100%;
    font-size: 26rpx;
    padding: 26.66rpx;
    box-sizing: border-box;
  }
</style>
