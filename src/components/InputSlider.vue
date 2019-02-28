<template>
	<div class="InputSlider__root">
		<Draggable
			:class="{InputSlider__slit: true, dragging: isDragging}"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="onDragend"
		>
			<div class="InputSlider__accum" :style="accumStyles"/>
			<div :class="{InputSlider__knob: true, exceed}" ref="knob" :style="knobStyles"/>
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
export default class InputSlider extends Vue {
	@Prop({type: Number, required: true}) private value!: number
	@Prop({type: Number, required: true}) private min!: number
	@Prop({type: Number, required: true}) private max!: number

	private knobOffset!: number

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

	private get exceed(): boolean {
		return this.value < this.min || this.max < this.value
	}

	private get zeroStyles(): object {
		return {
			left: `${ratio(0, this.min, this.max) * 100}%`
		}
	}

	private onDragstart(e: {
		current: vec2
		currentTarget: HTMLElement
		originalEvent: MouseEvent
	}) {
		this.isDragging = true

		if (e.originalEvent.target === this.$refs.knob) {
			const {offsetX} = e.originalEvent
			const half = (this.$refs.knob as HTMLElement).clientWidth / 2

			this.knobOffset = offsetX - half
		} else {
			this.knobOffset = 0
			this.onDrag(e)
		}
	}

	private onDrag(e: {current: vec2; currentTarget: HTMLElement}) {
		const {left, right} = mezr.rect(e.currentTarget)
		const t = ratio(e.current[0] - this.knobOffset, left, right, true)
		const value = lerp(this.min, this.max, t)

		this.$emit('input', value)
	}

	private onDragend() {
		this.isDragging = false
	}
}
</script>

<style lang="stylus" scoped>
.InputSlider__root
	position relative
	height 2em

$size = 1em

.InputSlider__slit
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

.InputSlider__accum
	position absolute
	top 50%
	margin-top -1.5px
	height 3px
	border-radius 1.5px
	background var(--color-control)

	:hover > &, .dragging > &
		background var(--color-active)

.InputSlider__knob
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

	.InputSlider__slit:hover &, .InputSlider__slit.dragging > &
		background var(--color-active)

		&.exceed
			border-color var(--color-active)

	.InputSlider__slit.dragging > &
		box-shadow 0 0 0 1px var(--color-active), 0 0 0 2px var(--color-bg)
</style>


