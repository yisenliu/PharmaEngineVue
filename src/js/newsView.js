import Vue from 'vue'
import App from '@/pages/newsView.vue'

Vue.config.productionTip = false
app.pageName = 'newsView'

new Vue({
  el: '#app',
  render: h => h(App)
})
