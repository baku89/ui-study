<template>
	<g>
		<line class="stroke" :x1="from[0]" :y1="from[1]" :x2="lineTo[0]" :y2="lineTo[1]"></line>
		<polygon class="fill" v-if="willShowTip" points="-10,-5, 0,0, -10,5" :transform="tipTransform"></polygon>
	</g>
</template>


<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'

@Component
export default class SvgArrow extends Vue {
	@Prop(Array) private from!: number[]
	@Prop(Array) private to!: number[]

	private _sub!: vec2
	private _lineTo!: vec2
	private _normalized!: vec2

	private created() {
		this._sub = vec2.create()
		this._lineTo = vec2.create()
		this._normalized = vec2.create()
	}

	get lineTo(): vec2 {
		vec2.normalize(this._normalized, this.sub)
		vec2.scaleAndAdd(
			this._lineTo,
			this.to,
			this._normalized,
			this.willShowTip ? -7 : 0
		)
		return this._lineTo
	}

	get sub(): vec2 {
		vec2.sub(this._sub, this.to, this.from)
		return this._sub
	}

	get willShowTip() {
		const sqrLen = vec2.squaredLength(this.sub)
		return sqrLen >= 100
	}

	get tipTransform() {
		const angle = (Math.atan2(this.sub[1], this.sub[0]) / Math.PI) * 180
		return `translate(${this.to[0]}, ${this.to[1]}) rotate(${angle})`
	}
}
</script>
