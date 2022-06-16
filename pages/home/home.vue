<template>
  <view class="container">
    <!-- <TopTitle title="校园集市"></TopTitle> -->
    <scroll-view class="scroll" scroll-y show-scrollbar="false" :refresher-enabled="isOpenRefresh"
      :refresher-triggered="isTopRefresh" :refresher-threshold="100" refresher-background="#efefef"
      @refresherrefresh="reachTop" @scrolltolower="reachBottom" lower-threshold="100">
      <AllList :AllList="categoryList" class="all"></AllList>
      <GoodsList :goodList="list3"></GoodsList>
    </scroll-view>
    <tabbar :currentIndex="selected"></tabbar>
  </view>
</template>

<script>
  import {
    categoryAll,
    goodsList
  } from "../../network/home.js"
  import {
    loginto
  } from '../../utils/login.js'
  import {
    mapMutations,
  } from "vuex"
  import {
    countImageHome2
  } from "../../mixins"
  export default {
    data() {
      return {
        selected: 0, //用来记录当前的选中的tabbar索引值
        categoryList: [],
        currentPage: 1, //当前页码
        categoryId: 0, //类别id
        heat: 0, //按热度排序
        pageSize: 20, //分页商品数量
        isReq: true, //开启上拉触底节流，是否可以发请求
        isTopRefresh: true,
        isOpenRefresh: true,
        isnone: false, // 上拉是否还有商品
      }
    },
    mixins: [countImageHome2],
    methods: {
      // 保存商品分类信息到仓库
      // ...mapMutations('home', ['saveGoodsCategory', 'clearGoodsList']),
	  //获取分类信息
	  ...mapMutations('category',['getCategoryName']),
      async categoryRequest() {
        const {
          data: res
        } = await categoryAll()
		if(res.msg==='success'){
			this.categoryList = Object.freeze(res.data)
			// this.saveGoodsCategory(res.data)
		}else{
			uni.showToast({
				title:res.msg,
				icon:"error"
			})
		}
      },
      async goodsListRequest() {
        const data = {
          categoryId: this.categoryId,
          currentPage: this.currentPage,
          heat: this.heat,
          pageSize: this.pageSize
        }
        const {
          data: res
        } = await goodsList(data)
        if(res.msg==='success'){
			if (res.data.records.length > 0) {
			  // 计算高度后并添加到list3
			  this.countImages(res.data.records)
			  this.isReq = true  // 关闭节流阀，下次可触发上拉加载
			} else {
			  //1.如果请求回来没有数据了,提示没有更多商品了,不关闭节流阀，继续节流
			  uni.showToast({
			    title: '没有更多商品了',
			    icon: 'none'
			  })
			  this.isnone = true //没有商品了，再次上拉触底时，触发提示
			  // }
			}
			//请求结束关闭下拉
			this.isTopRefresh = false
		}else{
			uni.showToast({
				title:res.msg,
				icon:"error"
			})
		}
      },
      //使用scroll-view组件开启上拉触底
      reachBottom() {
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
      //使用scroll-view组件开启下拉刷新
      reachTop() {
        //重置数据
        this.isTopRefresh = true
        this.currentPage = 1
        this.list3 = []
        this.isReq = true
        this.isnone = false
        //重新发请求获取商品数据
        this.goodsListRequest()
      },
    },
    async onLoad() {
      //执行完onlanch之后才会执行onLoad,确保有token
      await this.$onLaunched
      this.categoryRequest()
      this.goodsListRequest()
	  this.getCategoryName()
    },
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    padding: 26rpx;
    box-sizing: border-box;
    font-size: 24rpx;

    .scroll {
      height: calc(100vh - 100rpx);
    }
  }
</style>
