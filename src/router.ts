import Vue from 'vue'
import Router from 'vue-router'

import ComponentsList from './pages/ComponentsList.vue'
import ParameterControl from './pages/ParameterControl'
import TransformationMatrix from './pages/TransformationMatrix.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/components-list',
			name: 'components-list',
			component: ComponentsList
		},
		{
			path: '/parameter-control',
			name: 'parameter-control',
			component: ParameterControl
		},
		{
			path: '/transformation-matrix',
			name: 'transformation-matrix',
			component: TransformationMatrix
		}
	]
})
