import Vue from 'vue'
import App from '@/pages/about.vue'

Vue.config.productionTip = false
app.pageName = 'about'

new Vue({
  el: '#app',
  render: h => h(App)
})
