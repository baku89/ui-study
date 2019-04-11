<template>
	<g>
		<path class="stroke" v-if="Math.abs(diff) < 360" :d="d"></path>
		<circle class="stroke" v-else :cx="center[0]" :cy="center[1]" :r="radius"></circle>
		<polygon class="fill" v-if="willShowTip" points="-10,-5, 0,0, -10,5" :transform="tipTransform"></polygon>
	</g>
</template>


<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'
import {mod} from '../../math'

@Component
export default class SvgArcArrow extends Vue {
	@Prop(Array) private center!: number[]
	@Prop(Number) private radius!: number
	@Prop(Number) private start!: number
	@Prop(Number) private end!: number

	get diff() {
		return this.end - this.start
	}

	get startRadians() {
		return (this.start / 180) * Math.PI
	}

	get endRadians() {
		return (this.end / 180) * Math.PI
	}

	get x2() {
		return this.center[0] + Math.cos(this.endRadians) * this.radius
	}

	get y2() {
		return this.center[1] + Math.sin(this.endRadians) * this.radius
	}

	get d(): string {
		const diff = this.end - this.start

		const x1 = this.center[0] + Math.cos(this.startRadians) * this.radius
		const y1 = this.center[1] + Math.sin(this.startRadians) * this.radius

		const f1 = mod(Math.abs(diff), 360) > 180 ? 1 : 0
		const f2 = diff >= 0 ? 1 : 0

		return (
			`M ${x1} ${y1}` +
			`A ${this.radius} ${this.radius} 0 ${f1} ${f2} ${this.x2} ${this.y2}`
		)
	}

	get willShowTip() {
		return Math.abs(this.startRadians - this.endRadians) * this.radius >= 10
	}

	get tipTransform() {
		const rotate = this.end + 90 + (this.diff < 0 ? 180 : 0)
		return `translate(${this.x2}, ${this.y2}) rotate(${rotate})`
	}
}
</script>
