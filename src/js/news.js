import Vue from 'vue'
import App from '@/pages/news.vue'

Vue.config.productionTip = false
app.pageName = 'news'

new Vue({
  el: '#app',
  render: h => h(App)
})
