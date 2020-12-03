// import 'promise-polyfill';
import Vue from 'vue'
import Index from '@/pages/index.vue'
import '@/assets/js/generateResponsiveImages'

Vue.config.productionTip = false
app.pageName = 'index'

new Vue({
  el: '#app',
  render: h => h(Index)
})
