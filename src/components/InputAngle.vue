<template>
	<div class="InputAngle__root">
		<Draggable
			:class="{InputAngle__knob: true, dragging: isDragging}"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="onDragend"
			:style="{transform: `rotate(${this.value}deg)`}"
		/>
		<svg class="svg-overlay" v-if="isDragging">
			<line class="guide" :x1="dragFrom[0]" :y1="dragFrom[1]" :x2="dragTo[0]" :y2="dragTo[1]"></line>
			<SvgArcArrow :center="dragFrom" :radius="100" :start="0" :end="this.value"></SvgArcArrow>
		</svg>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import Draggable from './common/Draggable.vue'
import SvgArcArrow from './common/SvgArcArrow.vue'
import {vec2} from 'gl-matrix'
import {getDOMCenter, RoteryDrag} from '@/util'

@Component({
	components: {
		Draggable,
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

	private onDragstart(e: {current: number[]; currentTarget: HTMLElement}) {
		this.isDragging = true

		this.dragFrom = getDOMCenter(e.currentTarget)
		this.dragTo[0] = e.current[0]
		this.dragTo[1] = e.current[1]

		this.roteryDrag.start(this.value, this.dragFrom, this.dragTo)
	}

	private onDrag(e: {delta: vec2; current: vec2; currentTarget: HTMLElement}) {
		// Update HUD
		this.dragFrom = getDOMCenter(e.currentTarget)
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

.InputAngle__root
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

	&.dragging
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


