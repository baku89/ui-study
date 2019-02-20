import Vue from 'vue'
import Demo from './pages/Demo.vue'

Vue.config.productionTip = false

new Vue({
	render: h => h(Demo)
}).$mount('#demo')
