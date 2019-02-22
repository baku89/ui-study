import Vue from 'vue'
import Router from 'vue-router'
import ControlList from './pages/ControlList.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/control-list',
			name: 'control-list',
			component: ControlList
		}
	]
})
