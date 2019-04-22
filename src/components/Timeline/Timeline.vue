<template>
	<div class="Timeline">
		<Drag detectDirection="horizontal" measure="normalized" @dragstart="onDragstart" @drag="onDrag">
			<div class="Timeline__seekbar">
				<TimelineSeekbarScale :displayRange="Timeline.displayRange"/>
			</div>
		</Drag>
		<div class="Timeline__knob" :overflow="knobOverflow" :style="knobStyles" @click="scrollToTime">
			<div class="Timeline__knob-tip"/>
		</div>
		<div class="Timeline__contents">
			<slot :displayRange="Timeline.displayRange"></slot>
		</div>
		<InputRange
			class="Timeline__range no-slit"
			:value="Timeline.displayRange"
			:min="min"
			:max="max"
			:step="1"
			@input="onUpdateDisplayRange"
		/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'

import Drag from '../common/Drag'
import {ratio, quantize, clamp, lerp} from '../../math'
import {keypressed, MouseDragEvent} from '../../util'

import InputRange from '../InputRange.vue'
import TimelineSeekbarScale from './TimelineSeekbarScale.vue'
import {DataConfig, DefaultConfig} from '../../core'

@Component({
	components: {Drag, InputRange, TimelineSeekbarScale},
	provide() {
		return {
			Timeline: this.$data.Timeline
		}
	}
})
export default class Timeline extends Vue {
	@Prop({type: Number, required: true}) private time!: number
	@Prop({type: Number, required: true}) private min!: number
	@Prop({type: Number, required: true}) private max!: number
	@Prop({type: Boolean, default: false}) private autoScroll!: boolean

	@Inject({from: 'Config', default: DefaultConfig})
	private readonly Config!: DataConfig

	private Timeline = {
		displayRange: [0, 0]
	}

	private dragStartTime!: number

	private created() {
		this.Timeline.displayRange = [this.min, this.max]
	}

	private mounted() {
		// Mousewheel scrolling
		this.$el.addEventListener('mousewheel', this.onScroll)
	}

	private get knobOverflow(): 'start' | 'end' | null {
		if (this.time < this.Timeline.displayRange[0]) {
			return 'start'
		} else if (this.time > this.Timeline.displayRange[1]) {
			return 'end'
		} else {
			return null
		}
	}

	private get knobStyles(): object {
		const [start, end] = this.Timeline.displayRange
		const left = ratio(this.time, start, end + 1, true) * 100
		const width = Math.floor(100 / (end - start + 1))

		return {
			left: `${left}%`,
			width: `${width}%`
		}
	}

	private onDragstart(e: MouseDragEvent) {
		let newValue = lerp(
			this.Timeline.displayRange[0],
			this.Timeline.displayRange[1],
			e.current[0]
		)
		newValue = Math.round(newValue)
		this.dragStartTime = newValue
		this.$emit('update:time', newValue)
		this.$emit('scrubstart')
	}

	private onDrag(e: MouseDragEvent) {
		const [start, end] = this.Timeline.displayRange
		const originX = ratio(this.dragStartTime, start, end)
		let inc = (e.current[0] - originX) * (end - start)

		if (keypressed(this.Config.keySlower)) {
			inc *= 0.1
		}

		let newValue = this.dragStartTime + inc
		newValue = Math.round(newValue)
		newValue = clamp(newValue, start, end)

		if (this.time !== newValue) {
			this.$emit('update:time', newValue)
		}
	}

	private onUpdateDisplayRange([start, end]: [number, number]) {
		const {displayRange} = this.Timeline
		const duration = end - start
		let incStart = start - displayRange[0]
		let incEnd = end - displayRange[1]

		if (duration < 10) {
			const scaleCenter = 1 - ratio(-incEnd, 0, incStart - incEnd)

			const shortage = 10 - duration
			const incStartShortage = Math.round(shortage * scaleCenter)
			const incEndShortage = shortage - incStartShortage

			incStart -= incStartShortage
			incEnd += incEndShortage
		}

		this.$set(displayRange, 0, displayRange[0] + incStart)
		this.$set(displayRange, 1, displayRange[1] + incEnd)
	}

	@Watch('time')
	private onTimeChanged() {
		if (this.autoScroll) {
			this.scrollToTime()
		}
	}

	private scrollToTime() {
		const {displayRange} = this.Timeline
		const duration = displayRange[1] - displayRange[0]
		if (this.time < displayRange[0]) {
			this.$set(displayRange, 0, this.time)
			this.$set(displayRange, 1, this.time + duration)
		} else if (displayRange[1] < this.time) {
			this.$set(displayRange, 0, this.time - duration)
			this.$set(displayRange, 1, this.time)
		}
	}

	private onScroll(_e: Event) {
		const e = _e as MouseWheelEvent
		e.preventDefault()

		const [start, end] = this.Timeline.displayRange
		const framesPerPixel = (end - start) / this.$el.clientWidth
		let incStart, incEnd

		if (keypressed(this.Config.keyScale) || e.ctrlKey) {
			// Zoom in-out
			const {left, width} = this.$el.getBoundingClientRect()
			const scaleCenter = (e.clientX - left) / width

			// Fasten the speed a bit in a case of multi-touch trackpad pinching
			const inc = e.deltaY * (e.ctrlKey ? 2 : 1) * framesPerPixel

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
		this.$set(this.Timeline.displayRange, 0, start + incStart)
		this.$set(this.Timeline.displayRange, 1, end + incEnd)
	}
}
</script>

<style lang="stylus" scoped>
$seekbar-height = 2em
$knob-top = 0.2em

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
		margin-left -1px
		border-left 2px solid var(--color-seek)
		pointer-events none

		&[overflow]
			pointer-events auto

			&:before, &:after
				display none

		&:before, &:after
			position absolute
			right -2px
			left 0
			display block
			content ''

		// Colored highlight
		&:before
			top $seekbar-height - $knob-top
			margin-top -2px
			height 2px
			background var(--color-seek)

		// Dimmed highlight
		&:after
			top $seekbar-height - $knob-top
			bottom 0
			background var(--color-control)
			opacity 0.2

	&__knob-tip
		$size = 0.5em
		position absolute
		box-sizing content-box
		margin-left 'calc(%s - 1px)' % (-1 * $size)
		width 0
		height 0
		border-width $size $size 0 $size
		border-style solid
		border-color var(--color-seek) transparent transparent transparent
		transform scaleY(2)
		transform-origin 50% 0

		^[0]__knob[overflow='start'] &
			transform rotate(90deg) translate(50%, -200%) scaleY(2)

		^[0]__knob[overflow='end'] &
			transform rotate(-90deg) translate(-50%, -200%) scaleY(2)

	&__range
		position relative
		z-index 2
		height 1em
		background var(--color-bg)
</style>