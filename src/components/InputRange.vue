<template>
	<div class="InputRange__root">
		<Draggable
			class="InputRange__slit"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="onDragend"
			@mousemove.native="onMousemove"
			@mouseleave.native="onMouseleave"
			ref="slit"
		>
			<div
				:class="{InputRange__bar: true, inverted: this.value[0] > this.value[1], dragging: dragMode === 'bar', hover: hoverTarget === 'bar'}"
				:style="barStyle"
				ref="bar"
			/>
			<div
				:class="{InputRange__edge: true, first: true, dragging: dragMode === 'first', hover: hoverTarget === 'first'}"
				:style="firstStyle"
				ref="first"
			/>
			<div
				:class="{InputRange__edge: true, second: true, dragging: dragMode === 'second', hover: hoverTarget === 'second'}"
				:style="secondStyle"
				ref="second"
			/>
		</Draggable>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import Draggable from './common/Draggable.vue'
import {vec2} from 'gl-matrix'
import mezr from 'mezr'
import {lerp, clamp, ratio} from '@/math'

@Component({
	components: {
		Draggable
	}
})
export default class InputRange extends Vue {
	@Prop(Array) private value!: [number, number]
	@Prop(Number) private min!: number
	@Prop(Number) private max!: number

	private hoverTarget: 'bar' | 'first' | 'second' | null = null
	private dragMode: 'bar' | 'first' | 'second' | null = null

	get lower() {
		return Math.min(this.value[0], this.value[1])
	}

	get upper() {
		return Math.max(this.value[0], this.value[1])
	}

	get barStyle() {
		const lower = Math.min(this.value[0], this.value[1])
		const upper = Math.max(this.value[0], this.value[1])

		const left = ratio(lower, this.min, this.max, true) * 100
		const right = (1 - ratio(upper, this.min, this.max, true)) * 100
		return {
			left: `${left}%`,
			right: `${right}%`
		}
	}
	get firstStyle() {
		const left = ratio(this.value[0], this.min, this.max, true) * 100
		return {left: `${left}%`}
	}

	get secondStyle() {
		const left = ratio(this.value[1], this.min, this.max, true) * 100
		return {left: `${left}%`}
	}

	private onMousemove(e: MouseEvent) {
		const target = e.target

		if (this.dragMode === null) {
			if (target === this.$refs.first) {
				this.hoverTarget = 'first'
			} else if (target === this.$refs.second) {
				this.hoverTarget = 'second'
			} else {
				this.hoverTarget = 'bar'
			}
		}
	}

	private onMouseleave() {
		this.hoverTarget = null
	}

	private onDragstart(e: {
		current: vec2
		currentTarget: HTMLElement
		originalEvent: MouseEvent
	}) {
		this.dragMode = this.hoverTarget
	}

	private onDrag(e: {delta: vec2; currentTarget: HTMLElement}) {
		const width = (e.currentTarget as HTMLElement).clientWidth

		let inc = (e.delta[0] / width) * (this.max - this.min)

		// Limit the value of inc in advance not to exceed min/max
		if (this.dragMode === 'bar') {
			if (inc < 0 && this.lower + inc < this.min) {
				inc = -(this.lower - this.min)
			} else if (this.upper + inc > this.max) {
				inc = this.max - this.upper
			}
		}

		const newValue = Array.from(this.value)

		if (this.dragMode === 'bar' || this.dragMode === 'first') {
			newValue[0] += inc
		}
		if (this.dragMode === 'bar' || this.dragMode === 'second') {
			newValue[1] += inc
		}

		// Clamp
		newValue[0] = clamp(newValue[0], this.min, this.max)
		newValue[1] = clamp(newValue[1], this.min, this.max)

		if (inc !== 0) {
			this.$emit('input', newValue)
		}
	}

	private onDragend() {
		this.dragMode = null
	}
}
</script>

<style lang="stylus" scoped>
.InputRange__root
	position relative
	height 2em

$bar-width = 0.6em

.InputRange__slit
	position absolute
	top 0
	right 0.5 * $bar-width
	left 0.5 * $bar-width
	height 100%

	&:before
		position absolute
		top 50%
		right 0
		left 0
		display block
		margin-top -0.5px
		height 1px
		background var(--color-control)
		content ' '

.InputRange__bar
	position absolute
	top 50%
	margin-top -0.5 * $bar-width
	margin-right -0.5 * $bar-width
	margin-left -0.5 * $bar-width
	height $bar-width
	border-radius 0.5 * $bar-width
	background var(--color-control)
	box-shadow 0 0 0 1px var(--color-bg)

	&.inverted
		border 1px solid var(--color-control)
		background var(--color-bg)

	&.hover, &.dragging
		border none
		background var(--color-active)

	&.dragging
		box-shadow 0 0 0 1px var(--color-active), 0 0 0 2px var(--color-bg)

.InputRange__edge
	position absolute
	top 50%
	box-sizing content-box
	margin 'calc(%s - 1px)' % ($bar-width / -2)
	width $bar-width * 1
	height $bar-width
	border 1px solid transparent
	border-radius 50%
	$extend = 0 * $bar-width

	&.hover, &.dragging
		border-color var(--color-active)
		background var(--color-active)
		box-shadow 0 0 0 1px var(--color-bg)

	&.dragging
		margin 'calc(%s - 2px)' % ($bar-width / -2)
		border-width 2px

	&.first
		left $extend

	&.second
		right $extend
</style>


