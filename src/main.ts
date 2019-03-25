import Vue from 'vue'
import App from './App.vue'
import {glMatrix} from 'gl-matrix'

import router from './router'

glMatrix.setMatrixArrayType(Array)

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
