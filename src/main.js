// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'
import 'bootstrap'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { ValidationObserver, ValidationProvider, extend, localize, configure } from 'vee-validate'
import TW from 'vee-validate/dist/locale/zh_TW.json'
import * as rules from 'vee-validate/dist/rules'

import App from './App'
import router from './router'
import './bus'
import currencyFilter from './components/filters/currency'

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

localize('zh_TW', TW);

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
});

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.component('Loading', Loading)
Vue.filter('currency', currencyFilter)
/* eslint-disable no-new */


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    console.log("需驗證")
    const api = `${process.env.APIPATH}/api/user/check`
    axios.post(api).then((response) => {
      console.log(response.data)
      if (response.data.success) {
        next()
      }else{
        next ({
          path: '/login'
        })
      }
    })
  }else{
     next()
  }
})