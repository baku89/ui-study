<template>
	<div class="InputSlider">
		<Drag
			detectDirection="horizontal"
			measure="normalized"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="onDragend"
		>
			<div class="InputSlider__slit" ref="slit" :dragging="isDragging">
				<div class="InputSlider__accum" :style="accumStyles"/>
				<div class="InputSlider__knob" :exceeded="isExceeded" ref="knob" :style="knobStyles"/>
			</div>
		</Drag>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'

import {lerp, clamp, ratio, quantize} from '../math'
import BindManager from '../core/BindManager'

import Drag from './common/Drag'
import {DefaultConfig, DataConfig} from '../core'

@Component({
	components: {
		Drag
	}
})
export default class InputSlider extends Vue {
	@Prop({type: Number, required: true}) private value!: number
	@Prop({type: Number, required: true}) private min!: number
	@Prop({type: Number, required: true}) private max!: number
	@Prop(Number) private step!: number

	@Inject({from: 'Config', default: DefaultConfig})
	private readonly Config!: DataConfig

	private dragStartValue!: number

	private isDragging: boolean = false

	private get percent(): number {
		return ratio(this.value, this.min, this.max, true) * 100
	}

	private get accumStyles(): object {
		const crossZero = this.min * this.max < 0
		const startPercent = crossZero
			? ratio(0, this.min, this.max, true) * 100
			: 0

		return {
			left: `${Math.min(startPercent, this.percent)}%`,
			right: `${100 - Math.max(startPercent, this.percent)}%`
		}
	}

	private get knobStyles(): object {
		return {
			left: `${this.percent}%`
		}
	}

	private get isExceeded(): boolean {
		return this.value < this.min || this.max < this.value
	}

	private onDragstart(e: {current: vec2; originalEvent: MouseEvent}) {
		this.isDragging = true

		if (e.originalEvent.target === this.$refs.knob) {
			this.dragStartValue = this.value
		} else {
			const newValue = lerp(this.min, this.max, e.current[0])
			this.dragStartValue = newValue
			this.$emit('input', newValue)
		}
	}

	private onDrag(e: {current: vec2}) {
		const originX = ratio(this.dragStartValue, this.min, this.max)
		let inc = (e.current[0] - originX) * (this.max - this.min)

		if (BindManager.pressed(this.Config.keySlower)) {
			inc *= 0.1
		}

		let newValue = this.dragStartValue + inc

		if (this.step !== undefined) {
			newValue = quantize(newValue, this.step)
		}

		newValue = clamp(newValue, this.min, this.max)

		if (this.value !== newValue) {
			this.$emit('input', newValue)
		}
	}

	private onDragend() {
		this.isDragging = false
	}
}
</script>

<style lang="stylus" scoped>
.InputSlider
	position relative
	height var(--layout-input-height)
	$size = 1em

	&__slit
		position absolute
		top 0
		right 0.5 * $size
		left 0.5 * $size
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

	&__accum
		position absolute
		top 50%
		margin-top -1.5px
		height 3px
		border-radius 1.5px
		background var(--color-control)

		:hover > &, [dragging] > &
			background var(--color-active)

	&__knob
		position absolute
		top 50%
		margin-top -0.5 * $size
		margin-left -0.5 * $size
		width $size
		height $size
		border-radius 50%
		background var(--color-control)
		box-shadow 0 0 0 1px var(--color-bg)

		&.exceed
			border 1px solid var(--color-control)
			background var(--color-bg) !important

		^[0]__slit:hover &, ^[0]__slit[dragging] > &
			background var(--color-active)

			&[exceeded]
				border-color var(--color-active)

		^[0]__slit[dragging] > &
			box-shadow 0 0 0 1px var(--color-active), 0 0 0 2px var(--color-bg)
</style>