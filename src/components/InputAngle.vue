<template>
	<div class="InputAngle">
		<Drag @dragstart="onDragstart" @drag="onDrag" @dragend="onDragend">
			<button
				class="InputAngle__knob"
				:dragging="isDragging"
				ref="knob"
				:style="{transform: `rotate(${this.value}deg)`}"
			/>
		</Drag>
		<Portal v-if="isDragging">
			<svg class="svg-overlay">
				<line class="guide" :x1="dragFrom[0]" :y1="dragFrom[1]" :x2="dragTo[0]" :y2="dragTo[1]"></line>
				<SvgArcArrow :center="dragFrom" :radius="100" :start="0" :end="this.value"></SvgArcArrow>
			</svg>
		</Portal>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'
import {getDOMCenter, RoteryDrag} from '../util'

import Drag from './common/Drag'
import Portal from './common/Portal'
import SvgArcArrow from './common/SvgArcArrow.vue'

@Component({
	components: {
		Drag,
		Portal,
		SvgArcArrow
	}
})
export default class InputAngle extends Vue {
	@Prop(Number) private value!: number // in Degree

	private isDragging: boolean = false
	private dragFrom: number[] = [0, 0]
	private dragTo: number[] = [0, 0]

	private roteryDrag!: RoteryDrag

	private created() {
		this.roteryDrag = new RoteryDrag()
		this.roteryDrag.minDistance = 10
	}

	private onDragstart(e: {current: number[]}) {
		this.isDragging = true

		const $knob = this.$refs.knob as HTMLElement
		this.dragFrom = getDOMCenter($knob)
		this.dragTo[0] = e.current[0]
		this.dragTo[1] = e.current[1]

		this.roteryDrag.start(this.value, this.dragFrom, this.dragTo)
	}

	private onDrag(e: {delta: vec2; current: vec2}) {
		// Update HUD
		const $knob = this.$refs.knob as HTMLElement
		this.dragFrom = getDOMCenter($knob)
		this.dragTo[0] = e.current[0]
		this.dragTo[1] = e.current[1]

		const newValue = this.roteryDrag.getAngle(this.dragTo)
		this.$emit('input', newValue)
	}

	private onDragend() {
		this.isDragging = false
	}
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.InputAngle
	position relative
	width $input-height
	height $input-height

.InputAngle__knob
	position relative
	top 10%
	left 10%
	overflow hidden
	width 80%
	height 80%
	border-radius 50%
	background var(--color-control)

	&:hover
		background var(--color-active)

	&:focus
		background var(--color-active)

	&[dragging]
		top calc(10% - 1px)
		left calc(10% - 1px)
		z-index 200
		width calc(80% + 2px)
		height calc(80% + 2px)
		background var(--color-active)

	&:before
		position absolute
		top 50%
		left 50%
		display block
		margin-top -0.5px
		width 60%
		height 1px
		background var(--color-bg)
		content ' '
</style>


