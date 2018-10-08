import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import "bootstrap/dist/css/bootstrap.min.css";

console.log('start application...');

new Vue({
  render: h => h(App)
}).$mount('#app')


