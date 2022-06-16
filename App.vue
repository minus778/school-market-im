<script>
  import {
    loginto
  } from './utils/login.js'
  import {
      genTestUserSig
    } from './debug/GenerateTestUserSig.js'
  export default {

    onLaunch: function() {
      //#ifdef H5
      // 1:获取本页面的地址
      let local = window.location.href;
      // 2：获取code参数
      let code = ""
      if(local.includes("=")){
        let arr = local.split("=")
         code = arr[1]
         
      } 
      if (code == "") {
      //   function urlencode(str) {
      //     str = (str + '').toString();
      //     return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(
      //         /\)/g,
      //         '%29')
      //       .replace(/\*/g, '%2A').replace(/%20/g, '+');
      //   }
      //   let url = urlencode("https://weixin.yixun.club")
      //   window.location.replace(
      //     "https://open.weixin.qq.com/connect/qrconnect?" +
      //     "appid=" + "wxd4f08fd088e1ac77" + "&" +
      //     "redirect_uri=" + url + "&" +
      //     "scope=snsapi_login&state=mfjs#wechat_redirect")
      // }else{
        window.location.replace(
            "https://open.weixin.qq.com/connect/oauth2/authorize?" +
            "appid=" + "wxf1cd006b08f36150" + "&" +
            "redirect_uri=" + "https%3A%2F%2Fweixin.yixun.club" + "&" +
            "response_type=code&scope=snsapi_userinfo&state=mfjs&connect_redirect=1#wechat_redirect")
        }else{
       // 调用登录函数
       loginto(code).then(item => {
         console.log('app初始化，登录完成，用户信息保存至仓库')
         this.$isResolve()
         //当前用户登录即时通讯、用户登录为正式用户后才登录即时通讯
         if(item.nickname&&item.image){
         	this.imLogin(item)
         }
       }).catch(err => {
         uni.showToast({
           title: err,
           icon: "error"
         })
       }) 
      }
      //#endif

      //#ifdef MP-WEIXIN
      //调用登录函数
      console.log('初始化')
      loginto().then(item => {
        console.log('app初始化，登录完成，用户信息保存至仓库')
        this.$isResolve()
        //当前用户登录即时通讯、用户登录为正式用户后才登录即时通讯
		if(item.nickname&&item.image){
			this.imLogin(item)
		}
        
      }).catch(err => {
        uni.showToast({
          title: err,
          icon: "error"
        })
      })
      //#endif
    },
    onShow: function() {
      console.log('App Show')
      //隐藏官方tabbar
      uni.hideTabBar()
    },
    onHide: function() {
      console.log('App Hide')
    },
	methods:{
		//即时通讯登录(当前用户上线即时通讯)
		imLogin(info){
			const userId = String(info.id)
			let tim = this.$TIM.create({SDKAppID: this.$SDKAppID}); // SDK 实例通常用 tim 表示
			tim.setLogLevel(1); // 普通级别，日志量较多，接入时建议使用
			tim.registerPlugin({'tim-upload-plugin': this.$TIMUploadPlugin});
		
			// 登录
			let promise = tim.login({userID: userId, userSig: genTestUserSig(userId).userSig});
			promise.then((imResponse)=>{
		
				console.log('即时通讯登录成功',imResponse.data); // 登录成功
				if (imResponse.data.repeatLogin === true) {
					 // 标识账号已登录，本次登录操作为重复登录
					 console.log('即时通讯登录成功',imResponse.data.errorInfo);
				}
			}).catch((imError)=>{
				 console.log('即时通讯login error:', imError); // 登录失败的相关信息
			});
			// 监听SDKready后调用：
			tim.on(this.$TIM.EVENT.SDK_READY, (event)=>{
			  //保存用户信息
			  tim.updateMyProfile({
			  	nick:info.nickname,
			  	avatar:info.image,
			  	gender:info.gender===1?this.$TIM.TYPES.GENDER_MALE:this.$TIM.TYPES.GENDER_FEMALE
			  });
			});
		}
	}
  }
</script>

<style lang="scss">
  /*每个页面公共css */
  @import '@/uni_modules/uni-scss/index.scss';
  /* #ifndef APP-NVUE */
  @import '@/static/customicons.css';

  // 设置整个项目的背景色
  page {
    background-color: #f8f8f8;
  }

  /* #endif */
  .example-info {
    font-size: 14px;
    color: #333;
    padding: 10px;
  }
</style>
