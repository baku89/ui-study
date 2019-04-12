<template>
	<div class="InputRange">
		<Drag
			measure="normalized"
			coordinate="relative"
			detectDirection="horizontal"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="onDragend"
		>
			<div class="InputRange__slit" ref="slit" @mousemove="onMousemove" @mouseleave="onMouseleave">
				<div
					class="InputRange__bar"
					:inverted="this.value[0] > this.value[1]"
					:dragging="dragMode === 'bar'"
					:hover="hoverTarget === 'bar'"
					:style="barStyles"
					ref="bar"
				/>
				<div
					class="InputRange__edge first"
					:dragging="dragMode === 'first'"
					:hover="hoverTarget === 'first'"
					:style="firstStyles"
					ref="first"
				/>
				<div
					class="InputRange__edge second"
					:dragging="dragMode === 'second'"
					:hover="hoverTarget === 'second'"
					:style="secondStyles"
					ref="second"
				/>
			</div>
		</Drag>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject} from 'vue-property-decorator'
import Drag from './common/Drag'
import {vec2} from 'gl-matrix'
import {lerp, clamp, ratio} from '../math'
import keypressed from '../util/keypressed'

@Component({
	components: {
		Drag
	}
})
export default class InputRange extends Vue {
	@Prop({type: Array, required: true}) private value!: [number, number]
	@Prop({type: Number, required: true}) private min!: number
	@Prop({type: Number, required: true}) private max!: number

	@Inject({from: 'keySymmetry', default: 's'})
	private readonly keySymmetry!: string

	@Inject({from: 'keySlower', default: 'alt'})
	private readonly keySlower!: string

	private hoverTarget: 'bar' | 'first' | 'second' | null = null
	private dragMode: 'bar' | 'first' | 'second' | null = null

	private dragStartValue!: [number, number]

	get lower() {
		return Math.min(this.value[0], this.value[1])
	}

	get upper() {
		return Math.max(this.value[0], this.value[1])
	}

	get barStyles() {
		const lower = Math.min(this.value[0], this.value[1])
		const upper = Math.max(this.value[0], this.value[1])

		const left = ratio(lower, this.min, this.max, true) * 100
		const right = (1 - ratio(upper, this.min, this.max, true)) * 100
		return {
			left: `${left}%`,
			right: `${right}%`
		}
	}
	get firstStyles() {
		const left = ratio(this.value[0], this.min, this.max, true) * 100
		return {left: `${left}%`}
	}

	get secondStyles() {
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

	private onDragstart() {
		this.dragMode = this.hoverTarget
		this.dragStartValue = [this.value[0], this.value[1]]
	}

	private onDrag(e: {current: vec2}) {
		const isSymmetrical = keypressed(this.keySymmetry)
		const middle = lerp(this.dragStartValue[0], this.dragStartValue[1], 0.5)

		let inc = e.current[0] * (this.max - this.min)

		if (keypressed(this.keySlower)) {
			inc *= 0.1
		}

		let incMin = this.min - this.dragStartValue[0]
		let incMax = this.max - this.dragStartValue[1]

		if (this.dragMode === 'first') {
			if (isSymmetrical) {
				incMax = middle - this.dragStartValue[0]
			} else {
				incMax = this.dragStartValue[1] - this.dragStartValue[0]
			}
		} else if (this.dragMode === 'second') {
			if (isSymmetrical) {
				incMin = middle - this.dragStartValue[1]
			} else {
				incMin = this.dragStartValue[0] - this.dragStartValue[1]
			}
		}

		inc = clamp(inc, incMin, incMax)

		if (inc !== 0) {
			const newValue = Array.from(this.dragStartValue)

			// dragMode | bar | 1st | 2nd
			// ---------+-----+-----+-----
			//   isSym  | +/+ | +/- | -/+
			//  !isSym  | +/+ | +/o | o/+

			if (this.dragMode === 'bar') {
				newValue[0] += inc
				newValue[1] += inc
			} else if (this.dragMode === 'first') {
				newValue[0] += inc
				newValue[1] += isSymmetrical ? -inc : 0
			} else {
				newValue[0] += isSymmetrical ? -inc : 0
				newValue[1] += inc
			}

			// Clamp
			newValue[0] = clamp(newValue[0], this.min, newValue[1])
			newValue[1] = clamp(newValue[1], newValue[0], this.max)

			this.$emit('input', newValue)
		}
	}

	private onDragend() {
		this.dragMode = null
	}
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.InputRange
	position relative
	height 2em
	$bar-width = 0.6em

	&__slit
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

	&__bar
		position absolute
		top 50%
		margin-top -0.5 * $bar-width
		margin-right -0.5 * $bar-width
		margin-left -0.5 * $bar-width
		height $bar-width
		border-radius 0.5 * $bar-width
		background var(--color-control)
		box-shadow 0 0 0 1px var(--color-bg)

		&[inverted]
			border 1px solid var(--color-control)
			background var(--color-bg)

		&[hover], &[dragging]
			border none
			background var(--color-active)

		&[dragging]
			box-shadow 0 0 0 1px var(--color-active), 0 0 0 2px var(--color-bg)

	&__edge
		$extend = 0 * $bar-width
		position absolute
		top 50%
		box-sizing content-box
		margin 'calc(%s - 1px)' % ($bar-width / -2)
		width $bar-width
		height $bar-width
		border 1px solid transparent
		border-radius 0 50% 50% 0

		&:before
			position absolute
			top ($input-height - $bar-width) * -0.5
			display block
			width 300%
			height $input-height
			content ' '

		&[hover], &[dragging]
			border-color var(--color-active)
			background var(--color-active)
			box-shadow 0 0 0 1px var(--color-bg)

		&[dragging]
			margin 'calc(%s - 2px)' % ($bar-width / -2)
			border-width 2px

		&.first
			left $extend
			border-radius 50% 0 0 50%

			&:before
				right 0

		&.second
			right $extend

			&:before
				left 0
</style>


