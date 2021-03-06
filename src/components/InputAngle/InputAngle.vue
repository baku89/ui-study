<template>
	<div class="InputAngle">
		<Drag @dragstart="onDragstart" @drag="onDrag" @dragend="onDragend">
			<button
				class="InputAngle__knob"
				:class="{dragging}"
				ref="knob"
				:style="{transform: `rotate(${this.value}deg)`}"
			/>
		</Drag>
		<Portal v-if="dragging">
			<svg class="svg-overlay">
				<line class="guide" :x1="dragFrom[0]" :y1="dragFrom[1]" :x2="dragTo[0]" :y2="dragTo[1]"></line>
				<SvgArcArrow :center="dragFrom" :radius="100" :start="0" :end="this.value"></SvgArcArrow>
			</svg>
		</Portal>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'
import {getDOMCenter, RoteryDrag, MouseDragEvent} from '../../util'
import BindManager from '../../manager/BindManager'

import Drag from '../common/Drag'
import Portal from '../common/Portal'
import SvgArcArrow from '../common/SvgArcArrow.vue'
import {mod} from '../../math'
import {ConfigDefault} from '../../core/config'

@Component({
	components: {
		Drag,
		Portal,
		SvgArcArrow
	}
})
export default class InputAngle extends Vue {
	@Prop(Number) private value!: number // in Degree

	private dragging: boolean = false
	private dragFrom: number[] = [0, 0]
	private dragTo: number[] = [0, 0]

	private roteryDrag!: RoteryDrag

	@Inject({
		from: 'Config',
		default: ConfigDefault
	})
	private readonly Config!: any

	private created() {
		this.roteryDrag = new RoteryDrag()
	}

	private mounted() {
		this.roteryDrag.minDistance = this.$el.clientWidth
	}

	private onDragstart({current}: MouseDragEvent) {
		this.dragging = true

		const $knob = this.$refs.knob as HTMLElement
		this.dragFrom = getDOMCenter($knob)
		this.dragTo[0] = current[0]
		this.dragTo[1] = current[1]

		this.roteryDrag.start(this.value, this.dragFrom, this.dragTo)
	}

	private onDrag({current}: MouseDragEvent) {
		// Update HUD
		const $knob = this.$refs.knob as HTMLElement
		this.dragFrom = getDOMCenter($knob)
		this.dragTo[0] = current[0]
		this.dragTo[1] = current[1]

		let newValue = this.roteryDrag.getAngle(this.dragTo)

		// Quantize the angle
		if (BindManager.pressed(this.Config.keyQuantize)) {
			// Find the closest angle out of quantizeAngles
			// https://stackoverflow.com/questions/8584902/get-closest-number-out-of-array
			let angle = mod(newValue, 360)
			const turn = Math.floor(newValue / 360)

			angle = this.Config.quantizeAngles.reduce(
				(prev: number, curr: number) => {
					return Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
				}
			)

			newValue = turn * 360 + angle
		}

		this.$emit('input', newValue)
	}

	private onDragend() {
		this.dragging = false
	}
}
</script>

<style lang="stylus" scoped>
@import '../../style/config.styl'

.InputAngle
	position relative
	width var(--layout-input-height)
	height var(--layout-input-height)

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


