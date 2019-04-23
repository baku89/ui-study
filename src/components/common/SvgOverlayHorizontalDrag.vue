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
		<use :href="`#${speed}`" :transform="tipTransform"></use>
		<text
			:x="position[0]"
			:y="position[1]"
			:dx="direction === 'right' ? 6 : -6"
			class="text"
			dominant-baseline="central"
			:text-anchor="direction === 'right' ? 'start' : 'end'"
		>{{text}}</text>
	</g>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'

@Component({})
export default class SvgOverlayHorizontalDrag extends Vue {
	@Prop({type: Array, required: true}) private position!: vec2
	@Prop({type: String, required: true}) private direction!: 'left' | 'right'
	@Prop({type: String, default: 'normal'}) private speed!:
		| 'slow'
		| 'normal'
		| 'fast'
	@Prop({type: String, default: ''}) private text!: vec2

	private get tipTransform(): string {
		const p = this.position
		const sx = this.direction === 'right' ? 1 : -1
		return `translate(${p[0]} ${p[1]}) scale(${sx} 1)`
	}
}
</script>
