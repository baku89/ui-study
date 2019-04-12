<template>
	<div class="InputRange">
		<Drag
			coord="normalized"
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
import {Component, Prop, Vue} from 'vue-property-decorator'
import Drag from './common/Drag'
import {vec2} from 'gl-matrix'
import {lerp, clamp, ratio} from '../math'

@Component({
	components: {
		Drag
	}
})
export default class InputRange extends Vue {
	@Prop({type: Array, required: true}) private value!: [number, number]
	@Prop({type: Number, required: true}) private min!: number
	@Prop({type: Number, required: true}) private max!: number

	private hoverTarget: 'bar' | 'first' | 'second' | null = null
	private dragMode: 'bar' | 'first' | 'second' | null = null

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
	}

	private onDrag(e: {current: vec2; delta: vec2}) {
		let inc = e.delta[0] * (this.max - this.min)
		// Limit the value of inc in advance not to exceed min/max
		if (this.dragMode === 'bar') {
			if (inc < 0 && this.lower + inc < this.min) {
				inc = -(this.lower - this.min)
			} else if (this.upper + inc > this.max) {
				inc = this.max - this.upper
			}
		} else if (this.dragMode === 'first') {
			if (0 < inc && this.upper < this.lower + inc) {
				inc = this.upper - this.lower
			}
		} else if (this.dragMode === 'second') {
			if (inc < 0 && this.upper + inc < this.lower) {
				inc = this.lower - this.upper
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


