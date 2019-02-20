<template>
	<div class="wrapper">
		<Draggable
			:class="{knob: true, dragging: isDragging}"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="onDragend"
		>
			<svg class="icon">
				<line class="cross" x1="50%" y1="15%" x2="50%" y2="85%"></line>
				<line class="cross" x1="15%" y1="50%" x2="85%" y2="50%"></line>
			</svg>
		</Draggable>
		<svg class="svg-overlay" v-if="isDragging">
			<SvgArrow :from="dragFrom" :to="[dragFrom[0], dragTo[1]]"></SvgArrow>
			<SvgArrow :from="dragFrom" :to="[dragTo[0], dragFrom[1]]"></SvgArrow>
			<line class="guide" :x1="dragFrom[0]" :y1="dragTo[1]" :x2="dragTo[0]" :y2="dragTo[1]"></line>
			<line class="guide" :x1="dragTo[0]" :y1="dragFrom[1]" :x2="dragTo[0]" :y2="dragTo[1]"></line>
		</svg>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import Draggable from './common/Draggable.vue'
import SvgArrow from './common/SvgArrow.vue'
import {vec2} from 'gl-matrix'
import {getDOMCenter} from '@/util'

@Component({
	components: {
		Draggable,
		SvgArrow
	}
})
export default class InputPoint extends Vue {
	@Prop(Array) private value!: number[]

	private knobOffset: number[] = [0, 0]

	private isDragging: boolean = false
	private dragFrom: number[] = [0, 0]
	private dragTo: number[] = [0, 0]

	private onDragstart(e: {current: vec2; currentTarget: HTMLElement}) {
		this.isDragging = true

		this.dragFrom = getDOMCenter(e.currentTarget)
		this.dragTo[0] = this.dragFrom[0]
		this.dragTo[1] = this.dragFrom[1]

		this.knobOffset[0] = e.current[0] - this.dragFrom[0]
		this.knobOffset[1] = e.current[1] - this.dragFrom[1]
	}

	private onDrag(e: {delta: vec2; current: vec2; currentTarget: HTMLElement}) {
		const newValue = [this.value[0] + e.delta[0], this.value[0] + e.delta[1]]
		this.dragFrom = getDOMCenter(e.currentTarget)
		this.dragTo[0] = e.current[0] - this.knobOffset[0]
		this.dragTo[1] = e.current[1] - this.knobOffset[1]
		this.$emit('input', newValue)
	}

	private onDragend() {
		this.isDragging = false
	}
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.wrapper
	position relative
	width $input-height
	height $input-height

.knob
	position relative
	top 15%
	left 15%
	width 70%
	height 70%
	border-radius 35%
	background var(--color-control)

	&:hover
		background var(--color-active)

	&.dragging
		z-index 200
		background var(--color-active)
		box-shadow 0 0 0 1px var(--color-active)

	svg
		width 100%
		height 100%

		.cross
			stroke-width 1px
			stroke var(--color-bg)
</style>


