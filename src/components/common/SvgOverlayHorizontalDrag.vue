<template functional>
	<g>
		<symbol id="normal" style="overflow: visible">
			<polyline class="stroke" points="-10,-7, 0,0, -10,7"></polyline>
		</symbol>
		<symbol id="fast" style="overflow: visible">
			<polyline class="stroke" points="-10,-7, 0,0, -10,7"></polyline>
			<polyline class="stroke" points="-10,-7, 0,0, -10,7" transform="translate(-10 0)"></polyline>
		</symbol>
		<symbol id="slow" style="overflow: visible">
			<polyline class="dashed-stroke" points="-10,-7, 0,0, -10,7"></polyline>
		</symbol>
		<use
			:href="`#${props.speed}`"
			:transform="`translate(${props.position[0]} ${props.position[1]}) scale(${props.toRight ? 1 : -1} 1)`"
		></use>
		<text
			:x="props.position[0]"
			:y="props.position[1]"
			:dx="props.toRight ? 6 : -6"
			class="text"
			dominant-baseline="central"
			:text-anchor="props.toRight ? 'start' : 'end'"
		>{{props.text}}</text>
	</g>
</template>

<script lang="ts">
import Vue from 'vue'
import {vec2} from 'gl-matrix'

export default Vue.extend({
	name: 'SvgOverlayHorizontalDrag',
	// @ts-ignore
	functional: true,
	props: {
		position: Array,
		toRight: Boolean,
		speed: {type: String, default: 'normal'},
		text: {type: String, default: ''}
	}
})
</script>
