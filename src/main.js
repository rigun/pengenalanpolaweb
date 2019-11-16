import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './style/main.scss'
import vuetify from './vuetify'
import Buefy from 'buefy'

Vue.prototype.$apiUrl = 'http:///127.0.0.1:8000'
Vue.prototype.$modelUrl = 'http://127.0.0.1:5000'
Vue.prototype.$http = require('axios')
Vue.config.productionTip = false
Vue.use(Buefy)
new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
