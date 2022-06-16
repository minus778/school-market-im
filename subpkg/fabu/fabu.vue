<template>
  <view>
    <view class="fabu">
      <!-- <TopTitle title="发布" @back="back" iconsIsShow="true"></TopTitle> -->
      <view class="goods-box1">
        <view class="goods-name">
          <text class="name-left">商品名称</text>
          <input type="text" v-model="nameValue" placeholder="输入商品名称" class="name-right" maxlength="19"
            placeholder-style="color: #E3E3E3" />
        </view>
        <view class="goods-info">
          <view class="input">
            <!-- <input type="text" value="" placeholder="描述一下商品吧"/> -->
            <textarea name="saysth" rows="5" cols="30" placeholder="描述一下商品吧" placeholder-style="color: #E3E3E3"
              v-model="infoValue"></textarea>
            <view class="addimage">
              <view class="imageView" v-if="imageList.length">
                <view v-for="(item, i) in imageList" class="image" :key="i">
                  <uni-icons type="clear" class="delete" color="#ff7300" size="20" @click="deleteImg(i)"></uni-icons>
                  <image :src="item"></image>
                </view>
              </view>
              <image src="/static/images/pic.jpg" class="image" @click="addImage" v-if="imageList.length != 3"></image>
            </view>
          </view>
        </view>
      </view>
      <view class="goods-box2">
        <view class="goods-item1">
          <view class="item-left">
            <text>分类</text>
          </view>
          <view class="item-right">
            <picker mode="selector" :range="categoryList" value="0" @change="changeChoose">
              <text>{{
                categoryChoose === -1
                  ? "请选择分类"
                  : categoryList[categoryChoose]
              }}</text>
              <uni-icons type="forward" size="13"></uni-icons>
            </picker>
          </view>
        </view>
        <view class="goods-item2">
          <view class="item-left">
            <text>价格</text>
          </view>
          <view class="item-right">
            <text>￥</text>
            <input type="digit" maxlength="5" placeholder="0.00" placeholder-style="color: #FF0000;"
              v-model="priceValue" />
          </view>
        </view>
      </view>
      <view class="fabu-btn" @click="addGoods" v-show="hideshow">
        <text>发布</text>
      </view>
      <uni-popup ref="dialog" type="dialog">
        <uni-popup-dialog title="提示" content="完善联系方式,可以让买家联系到您" @close="dialogClose" @confirm="dialogConfirm">
        </uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>

<script>
  import {
    pushGoods,
    getCategory
  } from "../../network/fabu.js";
  import {
    mapState,
    mapActions
  } from "vuex";
  export default {
    data() {
      return {
        selected: 1, //用来记录当前的选中的tabbar索引值
        priceValue: "",
        nameValue: "",
        infoValue: "",
        imageList: [],
        categoryChoose: -1,
        docmHeight: document.documentElement.clientHeight, //默认屏幕高度
        showHeight: document.documentElement.clientHeight, //实时屏幕高度
        hideshow: true, //显示或者隐藏footer
      };
    },
    watch:{
      showHeight:function() {
          if(this.docmHeight > this.showHeight){
            this.hideshow=false
          }else{
            this.hideshow=true
          }
        }
    },
    mounted() {
      // window.onresize监听页面高度的变化
      window.onresize = ()=>{
        return(()=>{
          this.showHeight = document.body.clientHeight;
        })()
      }
    },
    //  onLoad() {
    //    this.getCategoryList();
    //  },
    computed: {
      ...mapState("user", ["userInfo"]),
      ...mapState("category", ["categoryList", 'categoryInfo']),
    },
    methods: {
      ...mapActions("user", ["updateUserShop"]),
      //取消提示弹窗
      dialogClose() {
        console.log("取消");
        //用户选择取消就直接发布商品
        this.requestFabu();
      },
      //确认提示弹窗
      dialogConfirm() {
        console.log("确认");
        //用户选择确认就跳转到编辑信息页
        uni.navigateTo({
          url: "/subpkg/setUser/setUser",
        });
      },
      async addGoods() {
        if (
          !this.infoValue ||
          !this.nameValue ||
          !this.priceValue ||
          this.categoryChoose == -1 ||
          !this.imageList.length
        ) {
          uni.showToast({
            title: "请填写完整商品的信息",
            icon: "none",
          });
          return;
        }
        let arr = this.priceValue.split('.') // 输入的价格以小数点分隔成的数组
        if (arr.length - 1 > 1 || arr[arr.length - 1] == "" || (arr.length !== 1 && arr[arr.length - 1].length >=
            3) || (arr[0].substr(0, 1) == "0" && arr[0].length > 1) || arr[0].length == 0) {
          uni.showToast({
            title: "价格信息输入有误",
            icon: "none",
          });
          return
        }
        //手机号为空就提示，否则就直接发请求
        if (this.userInfo.phone == "") {
          this.$refs.dialog.open();
        } else {
          this.requestFabu();
        }
      },
      async requestFabu() {
        const goodsInfo = {
          categoryId: this.categoryInfo[this.categoryChoose].id,
          info: this.infoValue,
          name: this.nameValue,
          price: parseFloat(this.priceValue),
          photo: this.imageList.join(","),
          // weChat:this.userInfo.weChart,
          // qq:this.userInfo.qq,
          phone: this.userInfo.phone,
        };
        console.log(goodsInfo);
        const {
          data
        } = await pushGoods(goodsInfo);
        console.log(data);
        if (data.msg === "success") {
          //发布成功重新更新仓库用户商品信息
          this.updateUserShop();
          uni.showToast({
            title: "发布成功",
            icon: "none",
          });
          //发布成功清空数据
          this.clearInfo();
          //跳转回上一个页面
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/home/home'
            })
          }, 500)
        } else {
          //发布失败
          uni.showToast({
            title: data.msg,
            icon: "none",
          });
        }
      },
      back() {
        uni.switchTab({
          url: "/pages/home/home",
        });
      },
      //添加图片
      addImage() {
        //回调函数的箭头指向问题导致回调函数的this指向的不是vue组件，定义that将组件的this保存下来
        const that = this;
        //从本地选择图片
        uni.chooseImage({
          // extension: [".png", ".jpg"],
          count: 3,
          sizeType: ['compressed'],
          // fail() {
          //   uni.showToast({
          //     title: "图片格式不支持~",
          //     icon: "error",
          //   });
          // },
          success(res) {

            uni.showLoading({
              title: "图片上传中~",
            })
            const images = res.tempFilePaths;
            //图片选择完成,发请求将图片上传到服务器
            console.log('图片', images)
            images.forEach((image) => {
              uni.uploadFile({
                url: "https://mfxy.tanghaolun.cn/api/v1/common/upload",
                filePath: image,
                name: "file",
                timeout:5000,
                formData: {
                  type: 1,
                  img_type: "dynamic",
                },
                fail(){
                      uni.hideLoading()
                      uni.showToast({
                        title: '图片大小超过限制，上传失败',
                        icon: "error",
                      });
                     },
                success(mes) {
                  uni.hideLoading()
                  console.log('返回图片', mes)
                  if (mes.statusCode === 200) {
                    const data = JSON.parse(mes.data);
                    //图片上传出错
                    if (data.errNo != 0) {
                      uni.showToast({
                        title: data.errstr,
                        icon: "error",
                      });
                      return;
                    }
                    //图片上传成功返回图片
                    that.imageList.push(data.data);
                  }
                  if (mes.statusCode === 413) {
                    uni.showToast({
                      title: '图片大小超过限制，上传失败',
                      icon: "error",
                    });
                  }
                },
              });
            });
          },
        });
      },
      //删除图片
      deleteImg(i) {
        this.imageList.splice(i, 1);
      },
      //清空数据
      clearInfo() {
        this.categoryChoose = -1
        this.priceValue = ""
        this.nameValue = ""
        this.infoValue = ""
        this.imageList = []
      },
      //  //获取分类信息
      //  async getCategoryList() {
      //    const { data: res } = await getCategory();
      // console.log(res)
      //    this.categoryInfo = res.data;
      //    this.categoryList = this.categoryInfo.map((item) => item.name);
      //  },
      //修改选择的分类
      changeChoose(e) {
        this.categoryChoose = e.detail.value;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .fabu {
    width: 100%;
    font-size: 26rpx;
    padding: 26.66rpx;

    box-sizing: border-box;

    // background-color: #5989B9;
    .goods-box1 {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      background-color: #ffffff;
      margin-bottom: 30rpx;
      border-radius: 20rpx;

      .goods-name {
        width: 597.34rpx;

        box-sizing: border-box;
        height: 93.34rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 4rpx solid #f7f7f9;

        // padding: 0 17.67px 0 18px;
        // background-color: #00CE47;
        .name-left {
          font-size: 31.34rpx;
          font-family: AlibabaPuHuiTi-Regular;
          color: #000000;
        }

        .name-right {
          height: 100%;
          width: 190rpx;
          font-size: 31.34rpx;
          font-family: AlibabaPuHuiTi-Regular;
          // color: #E3E3E3;
        }
      }

      .goods-info {
        width: 597.34rpx;
        height: 360rpx;
        margin-top: 32.66rpx;
        display: flex;
        flex-direction: column;
        position: relative;

        .input {
          width: 597.34rpx;
          font-family: AlibabaPuHuiTi-Regular;
          // color: #E3E3E3;
          font-size: 31.34rpx;

          // background-color: #007AFF;
          textarea {
            height: 144rpx;
          }

          .addimage {
            display: flex;

            .image {
              position: relative;
              width: 188rpx;
              height: 188rpx;
              border-radius: 16.66rpx;
              margin-right: 10rpx;
              overflow: hidden;

              image {
                width: 100%;
                height: 100%;
              }

              .delete {
                position: absolute;
                right: 0rpx;
                z-index: 999;
              }
            }

            .imageView {
              display: flex;
            }
          }
        }
      }
    }

    .goods-box2 {
      display: flex;
      width: 100%;
      height: 200rpx;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      background-color: #ffffff;
      border-radius: 20rpx;

      .goods-item1,
      .goods-item2 {
        display: flex;
        width: 597.34rpx;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2rpx solid #f7f7f9;
        line-height: 98rpx;

        .item-left {
          font-size: 31.34rpx;
          font-family: AlibabaPuHuiTi-Regular;
          color: #000000;
        }
      }

      .goods-item1 .item-right {
        width: 156rpx;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-around;

        text {
          font-size: 25.34rpx;
          color: #7f7f7f;
        }
      }

      .goods-item2 {
        .item-right {
          font-size: 29.34rpx;
          font-family: AlibabaPuHuiTi-Bold;
          color: #ff0000;
          font-weight: Bold;
          display: flex;
          align-items: center;

          input {
            width: 110rpx;
            border: 0;
          }
        }
      }
    }

    .fabu-btn {
      width: 485.34rpx;
      height: 80rpx;
      position: fixed;
      left: 50%;
      bottom: 130rpx;
      transform: translateX(-50%);
      border-radius: 40rpx;
      background-color: #ff7300;
      text-align: center;
      font-size: 34.56rpx;
      font-family: AlibabaPuHuiTi-Regular;
      line-height: 80rpx;
      color: #ffffff;
    }
  }
</style>
