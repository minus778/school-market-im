<template>
  <view class="setuser">
    <!-- <view class="toptitle">
      <TopTitle title="个人信息" iconsIsShow="true" @back="back"></TopTitle>
    </view> -->
    <view class="info">
      <view class="info-item">
        <text>头像</text>
        <view class="img" @click="changeImage">
          <image :src="userInfo.image"></image>
          <uni-icons type="forward" size="17"></uni-icons>
        </view>
      </view>
      <view class="info-item">
        <text>昵称</text>
        <input v-model="userInfo.nickname" class="input" maxlength="11" />
      </view>
      <view class="info-item">
        <text>性别</text>
        <picker mode="selector" :range="data" :value="userInfo.gender === 1 ? 0 : 1" @change="changeChoose">
          <text>{{ userInfo.gender === 1 ? "男" : "女" }}</text>
        </picker>
      </view>
      <view class="info-item">
        <text>学校</text>
        <text>{{ userSchool.name || userInfo.school }}</text>
      </view>
      <!-- <view class="info-item">
				<text>QQ</text>
				<input v-model="userInfo.qq" class="input" :placeholder="userInfo.qq===''?'待完善':''"/>
			</view>
			<view class="info-item">
				<text>微信</text>
				<input v-model="userInfo.weChart" class="input" :placeholder="userInfo.weChart===''?'待完善':''"/>
			</view> -->
      <view class="info-item">
        <text>手机号</text>
        <input type="number" maxlength="11" v-model="userInfo.phone" class="input"
          :placeholder="userInfo.phone === '' ? '待完善' : ''" />
      </view>
    </view>
    <ClickButton title="保存" class="button" @clickto="update"  v-show="hideshow"></ClickButton>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapGetters
  } from "vuex";
  import {
    updateUserInfo,
    getUserInfo
  } from "../../network/index.js";
  import {
    isPhone
  } from "../../utils/validate.js";
  export default {
    data() {
      return {
        data: ["男", "女"],
        image: "",
        userInfo: {},
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
    onShow() {
      //JSON.parse(JSON.stringify())就是将对象深拷贝，直接赋值是浅拷贝，组件修改会影响到仓库的state
      this.userInfo = JSON.parse(JSON.stringify(this.$store.state.user.userInfo))
    },
    computed: {
      ...mapState("user", ["userSchool"]),
    },
    methods: {
      ...mapMutations("user", ["updateInfo"]),
      changeChoose(e) {
        if (e.detail.value === "0") {
          this.userInfo.gender = 1;
        }
        if (e.detail.value === "1") {
          this.userInfo.gender = 0;
        }
      },
      async update() {
        //判断手机号是否是正确格式
        if (this.userInfo.phone != "") {
          let res = isPhone(this.userInfo.phone);
          //手机号格式不正确，清空再return终止请求
          if (!res) {
            uni.showToast({
              title: "请输入11位正确格式的手机号",
              icon: "none", //图标
            });
            this.userInfo.phone = "";
            return;
          }
        }
        let data = {
          image: this.userInfo.image,
          nickname: this.userInfo.nickname,
          gender: this.userInfo.gender,
          // qq:this.userInfo.qq,
          // weChart:this.userInfo.weChart,
          phone: this.userInfo.phone,
        };
        let res = await updateUserInfo(data);
        if (res.data.msg === "success") {
          //修改信息成功
          console.log("用户信息修改成功");
          //创建SDK实例
          let tim = this.$TIM.create({
            SDKAppID: this.$SDKAppID
          });
          //保存用户信息
          tim.updateMyProfile({
            nick: data.nickname,
            avatar: data.image,
            gender: data.gender === 1 ? this.$TIM.TYPES.GENDER_MALE : this.$TIM.TYPES.GENDER_FEMALE
          });
          uni.showToast({
            title: "保存成功",
            icon: "none",
          });
          //保存用户信息到本地仓库
          this.updateInfo(data);
        }
      },
      // async back() {
      //   uni.navigateBack();
      // },
      //修改头像
      changeImage() {
        //回调函数的箭头指向问题导致回调函数的this指向的不是vue组件，定义that将组件的this保存下来
        const that = this;
        //从本地选择图片
        uni.chooseImage({
          count: 1,
          success(res) {
            uni.showLoading({
              title: "图片上传中~",
            })
            const images = res.tempFilePaths;
            //图片选择完成,发请求将图片上传到服务器
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
                    //图片上传成功返回图片，将头像信息展示保存在个人信息页面，如果点击保存，再保存到仓库
                    that.userInfo.image = data.data;
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
    },
  };
</script>

<style lang="scss">
  .setuser {
    .button {
      width: 640rpx;
    }

    .toptitle {
      height: 140rpx;
      padding: 30rpx 40rpx 0rpx;
      background-color: white;
    }

    .info {
      margin: 20rpx;
      background-color: white;
      border-radius: 30rpx;
      padding: 20rpx 40rpx;

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 0rpx 30rpx 10rpx;
        font-size: 30rpx;

        input {
          text-align: right;
        }

        .img {
          display: flex;
          justify-content: space-between;
          align-items: center;

          image {
            width: 90rpx;
            height: 90rpx;
            border-radius: 50%;
            overflow: hidden;
          }
        }

        &:nth-child(-n + 4) {
          border-bottom: 1px solid #f7f7f7;
        }
      }
    }
  }
</style>
