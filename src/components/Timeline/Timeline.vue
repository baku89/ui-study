<template>
	<div class="Timeline">
		<Drag detectDirection="horizontal" measure="normalized" @dragstart="onDragstart" @drag="onDrag">
			<div class="Timeline__seekbar">
				<TimelineSeekbarScale :displayRange="displayRange"/>
			</div>
		</Drag>
		<div class="Timeline__knob" ref="knob" :style="knobStyles">
			<div class="Timeline__knob-tip"/>
		</div>
		<div class="Timeline__contents">
			<slot :displayRange="displayRange"></slot>
		</div>
		<InputRange
			class="Timeline__range no-slit"
			v-model="displayRange"
			:min="min"
			:max="max"
			:step="1"
		/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'

import Drag from '../common/Drag'
import {ratio, quantize, clamp, lerp} from '../../math'
import {keypressed} from '../../util'

import InputRange from '../InputRange.vue'
import TimelineSeekbarScale from './TimelineSeekbarScale.vue'

@Component({components: {Drag, InputRange, TimelineSeekbarScale}})
export default class Timeline extends Vue {
	@Prop({type: Number, required: true}) private time!: number
	@Prop({type: Number, required: true}) private min!: number
	@Prop({type: Number, required: true}) private max!: number
	@Prop({type: Boolean, default: false}) private autoScroll!: boolean

	@Inject({from: 'keySymmetry', default: 'alt'})
	private readonly keySymmetry!: string

	private displayRange: [number, number] = [0, 0]

	@Inject({from: 'keySlower', default: 'alt'})
	private readonly keySlower!: string

	private dragStartTime!: number

	private created() {
		this.displayRange = [this.min, this.max]
	}

	private mounted() {
		// Mousewheel scrolling
		this.$el.addEventListener('mousewheel', (_e: Event) => {
			const e = _e as MouseWheelEvent
			e.preventDefault()

			const [start, end] = this.displayRange

			const framesPerPixel = (end - start) / this.$el.clientWidth

			let incStart, incEnd

			if (keypressed(this.keySymmetry)) {
				const {left, width} = this.$el.getBoundingClientRect()
				const scaleCenter = (e.clientX - left) / width
				let inc = e.deltaY * framesPerPixel

				incStart = -inc * scaleCenter
				incEnd = inc * (1 - scaleCenter)

				// Make sure to scroll at least 1 frame
				if (Math.abs(incStart) < 1) {
					incStart = Math.sign(incStart)
				}
				if (Math.abs(incEnd) < 1) {
					incEnd = Math.sign(incEnd)
				}

				// Then round the range to integer
				incStart = Math.round(incStart)
				incEnd = Math.round(incEnd)

				// Minimum duration
				const duration = end + incEnd - (start + incStart)
				if (duration < 10) {
					const shortage = 10 - duration
					const incStartShortage = Math.round(shortage * scaleCenter)
					const incEndShortage = shortage - incStartShortage

					incStart -= incStartShortage
					incEnd += incEndShortage
				}

				// Clamp within min/max
				if (start + incStart < this.min) {
					incStart = this.min - start
				}
				if (end + incEnd > this.max) {
					incEnd = this.max - end
				}
			} else {
				incStart = e.deltaX * framesPerPixel

				// Make sure to scroll at least 1 frame
				if (Math.abs(incStart) < 1) {
					incStart = Math.sign(incStart)
				}

				// Then round the range to integer
				incStart = Math.round(incStart)

				// Clamp within min/max
				if (start + incStart < this.min) {
					incStart = this.min - start
				}
				if (end + incStart > this.max) {
					incStart = this.max - end
				}

				incEnd = incStart
			}

			// Set
			this.$set(this.displayRange, 0, start + incStart)
			this.$set(this.displayRange, 1, end + incEnd)
		})
	}

	private get knobStyles(): object {
		const left =
			ratio(this.time, this.displayRange[0], this.displayRange[1] + 1) * 100
		const width = Math.floor(
			100 / (this.displayRange[1] - this.displayRange[0] + 1)
		)

		return {
			left: `${left}%`,
			width: `${width}%`
		}
	}

	private onDragstart(e: {current: vec2; originalEvent: MouseEvent}) {
		let newValue = lerp(
			this.displayRange[0],
			this.displayRange[1],
			e.current[0]
		)
		newValue = Math.round(newValue)
		this.dragStartTime = newValue
		this.$emit('update:time', newValue)
		this.$emit('scrubstart')
	}

	private onDrag(e: {current: vec2}) {
		const originX = ratio(
			this.dragStartTime,
			this.displayRange[0],
			this.displayRange[1]
		)
		let inc =
			(e.current[0] - originX) * (this.displayRange[1] - this.displayRange[0])

		if (keypressed(this.keySlower)) {
			inc *= 0.1
		}

		let newValue = this.dragStartTime + inc
		newValue = Math.round(newValue)
		newValue = clamp(newValue, this.displayRange[0], this.displayRange[1])

		if (this.time !== newValue) {
			this.$emit('update:time', newValue)
		}
	}

	@Watch('time')
	private onTimeChanged() {
		if (this.autoScroll) {
			const duration = this.displayRange[1] - this.displayRange[0]
			if (this.time < this.displayRange[0]) {
				this.$set(this.displayRange, 0, this.time)
				this.$set(this.displayRange, 1, this.time + duration)
			} else if (this.displayRange[1] < this.time) {
				this.$set(this.displayRange, 0, this.time - duration)
				this.$set(this.displayRange, 1, this.time)
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
$seekbar-height = 2em
$knob-top = 0.3em

.Timeline
	position relative
	overflow hidden
	margin-bottom 30em
	background var(--color-bg)

	&__seekbar
		position relative
		height $seekbar-height
		border-bottom 1px solid var(--color-border)

	&__knob
		position absolute
		top $knob-top
		bottom 0
		z-index 1
		border-left 2px solid var(--color-seek)
		pointer-events none

		&:before, &:after
			position absolute
			display block
			width 100%
			content ''

		&:before
			top $seekbar-height - $knob-top
			margin-top -2px
			height 2px
			background var(--color-seek)

		// Highlight
		&:after
			top $seekbar-height - $knob-top
			bottom 0
			background var(--color-control)
			opacity 0.2

	&__knob-tip
		$size = 0.4em
		position absolute
		box-sizing content-box
		margin-left 'calc(%s - 1px)' % (-1 * $size)
		width 0
		height 0
		border-width $size $size 0 $size
		border-style solid
		border-color var(--color-seek) transparent transparent transparent
		transform scaleY(2)
		transform-origin 0 0

	&__range
		position relative
		z-index 2
		height 1em
		background var(--color-bg)
</style>