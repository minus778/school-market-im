
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

import store from './store'

//引入即时通讯
import TIM from 'tim-wx-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
Vue.prototype.$TIM = TIM
Vue.prototype.$TIMUploadPlugin = TIMUploadPlugin
Vue.prototype.$SDKAppID = 1400683775


Vue.config.productionTip = false

Vue.prototype.$onLaunched = new Promise(resolve => {
    Vue.prototype.$isResolve = resolve
})

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif