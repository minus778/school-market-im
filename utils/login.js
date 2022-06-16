import store from '../store/index.js'
import {
  login,
  loginH5
} from '../network/index.js'
export function loginto(code, checkschool = true, checkuser = false) {
  //#ifdef MP-WEIXIN
  //发起获取用户信息登录请求
  //返回一个promise，方便外界了解login是否执行完成
  return new Promise((resolve, reject) => {
    uni.login().then(async (res) => {
      const [err, data] = res
      console.log('登录code:', data.code)
      let {
        data: ress
      } = await login(data.code)
      console.log('登录返回的用户信息:', ress.data)
      //将请求获取的数据存到vuex仓库
      store.commit('user/saveUserInfo', ress.data)
      const userinfo = store.state.user.userInfo
      //是否需要对学校信息进行检验
      if (checkschool) {
        //游客模式选择学校保存在本地，不需要检验login返回的数据
        //跳转到选择学校页面
        if (!userinfo.school) {
          console.log('本地学校信息为空，跳转到学校页')
          uni.redirectTo({
            url: '/subpkg/school/school',
          })
        }
      }
      //如果需要登录为正式用户就进行判断
      if (checkuser) {
        //判断本地是否有学校信息
        if (!userinfo.school) {
          //本地没有学校信息就跳转到学校页选择
          console.log('本地学校信息为空，跳转到学校页')
          uni.redirectTo({
            url: '/subpkg/school/school',
          })
        } else {
          //判断本地有学校信息
          //1、判断返回信息中是否存在学校信息
          if (!userinfo.school) {
            //如果登录为正式用户返回的信息中没有学校信息，就把游客模式下选择的学校信息赋值给正式用户仓库存储的学校信息
            console.log('登录为正式用户，返回的数据没有学校信息，将本地学校信息赋值给仓库正式用户的学校信息并提交给服务器')
            store.dispatch('updateSchoolInfo')
          }
          //2、返回用户信息为空则跳转到登录页面
          if (!userinfo.nickname && !userinfo.image) {
            console.log('登录为正式用户，返回的数据没有用户信息，跳转到登录页')
            uni.navigateTo({
              url: "/subpkg/login/login"
            })
          }
        }
      }
      resolve(userinfo)
    }).catch(err => {
      console.log('错误：', err)
      reject()
    })
  })
  //#endif

  //#ifdef H5
  //发起获取用户信息登录请求
  //返回一个promise，方便外界了解login是否执行完成
  return new Promise((resolve, reject) => {
    loginH5(code).then(res => {
      let ress = res.data
      console.log('登录返回的用户信息:', ress.data)
      //将请求获取的数据存到vuex仓库
      store.commit('user/saveUserInfo', ress.data)
      const userinfo = store.state.user.userInfo
      //是否需要对学校信息进行检验
      if (checkschool) {
        //游客模式选择学校保存在本地，不需要检验login返回的数据
        //跳转到选择学校页面
        if (!userinfo.school) {
          console.log('学校信息为空，跳转到学校页')
          uni.redirectTo({
            url: '/subpkg/school/school',
          })
        }else{
			console.log('存在学校信息，保存到本地')
			uni.setStorageSync('userSchool',userinfo.school)
		}
      }
      //如果需要登录为正式用户就进行判断
      if (checkuser) {
        //1、判断本地是否有学校信息
        if (!userinfo.school) {
          //本地没有学校信息就跳转到学校页选择
          console.log('学校信息为空，跳转到学校页')
          uni.redirectTo({
            url: '/subpkg/school/school',
          })
        } else {
          // //判断本地有学校信息
          // //1、判断返回信息中是否存在学校信息
          // if (!userinfo.school) {
          //   //如果登录为正式用户返回的信息中没有学校信息，就把游客模式下选择的学校信息赋值给正式用户仓库存储的学校信息
          //   console.log('登录为正式用户，返回的数据没有学校信息，将本地学校信息赋值给仓库正式用户的学校信息并提交给服务器')
          //   store.dispatch('updateSchoolInfo')
          // }
          //2、返回用户信息为空则跳转到登录页面
          if (!userinfo.nickname && !userinfo.image) {
            console.log('登录为正式用户，返回的数据没有用户信息，跳转到登录页')
            uni.navigateTo({
              url: "/subpkg/login/login"
            })
          }
        }
      }
      resolve(userinfo)
    }).catch(err => {
      console.log('错误：', err)
      reject()
    })
  })
  //#endif
}
