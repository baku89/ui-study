import Vue from 'vue'
import Router from 'vue-router'

import Abstract from './pages/Abstract.vue'
import ComponentsList from './pages/ComponentsList.vue'
import ParameterControl from './pages/ParameterControl'
import TransformationMatrix from './pages/TransformationMatrix'
import GraphicsOnLisp from './pages/GraphicsOnLisp'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/abstract',
			name: 'abstract',
			component: Abstract
		},
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
		},
		{
			path: '/graphics-on-lisp',
			name: 'graphics-on-lisp',
			component: GraphicsOnLisp
		}
	]
})
