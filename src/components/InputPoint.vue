<template>
	<div class="InputPoint">
		<Drag :dragging.sync="dragging" @dragstart="onDragstart" @drag="onDrag">
			<button
				class="InputPoint__knob"
				:class="{dragging}"
				ref="knob"
				@keydown="onKeydown"
				@keyup="onKeyup"
			>
				<svg class="InputPoint__icon svg-ui">
					<line class="cross" x1="50%" y1="15%" x2="50%" y2="85%"></line>
					<line class="cross" x1="15%" y1="50%" x2="85%" y2="50%"></line>
					<svg class="svg-ui" v-if="ui.keyArrowAngle !== null" x="calc(50%)" y="50%">
						<g :transform="`rotate(${ui.keyArrowAngle})`">
							<polygon class="fill" points="-10,-5, 0,0, -10,5" transform="translate(21, 0)"></polygon>
						</g>
					</svg>
				</svg>
			</button>
		</Drag>
		<svg class="InputPoint__svg svg-overlay" v-if="dragging">
			<line class="guide" :x1="dragFrom[0]" :y1="dragTo[1]" :x2="dragTo[0]" :y2="dragTo[1]"></line>
			<line class="guide" :x1="dragTo[0]" :y1="dragFrom[1]" :x2="dragTo[0]" :y2="dragTo[1]"></line>
			<SvgArrow :from="dragFrom" :to="[dragFrom[0], dragTo[1]]"></SvgArrow>
			<SvgArrow :from="dragFrom" :to="[dragTo[0], dragFrom[1]]"></SvgArrow>
		</svg>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject} from 'vue-property-decorator'
import keycode from 'keycode'
import {vec2} from 'gl-matrix'

import Drag from './common/Drag'
import SvgArrow from './common/SvgArrow.vue'
import {getDOMCenter} from '../util'
import {DataConfig, DefaultConfig} from '../core'
import BindManager from '../core/BindManager'

interface ArrowKeyInfo {
	delta: number[]
	angle: number
}

const ARROW_KEY_INFO = new Map<string, ArrowKeyInfo>([
	['right', {delta: [+1, 0], angle: 0}],
	['left', {delta: [-1, 0], angle: 180}],
	['up', {delta: [0, -1], angle: 270}],
	['down', {delta: [0, +1], angle: 90}]
])

@Component({
	components: {
		Drag,
		SvgArrow
	}
})
export default class InputPoint extends Vue {
	@Prop(Array) private value!: number[]

	private knobOffset: number[] = [0, 0]

	private dragging: boolean = false
	private dragFrom: number[] = [0, 0]
	private dragTo: number[] = [0, 0]

	@Inject({from: 'Config', default: DefaultConfig})
	private readonly Config!: DataConfig

	// UI
	private ui: {
		keyArrowAngle: null | number
	} = {
		keyArrowAngle: null
	}

	private onKeydown(e: KeyboardEvent) {
		const key = keycode(e)
		const info = ARROW_KEY_INFO.get(key)

		if (info !== undefined) {
			e.preventDefault()

			const multiplier = BindManager.pressed(this.Config.keyFaster)
				? 10
				: BindManager.pressed(this.Config.keySlower)
				? 0.1
				: 1
			const newValue = [
				this.value[0] + info.delta[0] * multiplier,
				this.value[1] + info.delta[1] * multiplier
			]

			this.ui.keyArrowAngle = info.angle

			this.$emit('input', newValue)
		}
	}

	private onKeyup() {
		this.ui.keyArrowAngle = null
	}

	private onDragstart(e: {current: vec2}) {
		const $knob = this.$refs.knob as HTMLElement
		this.dragFrom = getDOMCenter($knob)

		this.dragTo[0] = this.dragFrom[0]
		this.dragTo[1] = this.dragFrom[1]
		this.knobOffset[0] = e.current[0] - this.dragFrom[0]
		this.knobOffset[1] = e.current[1] - this.dragFrom[1]
	}

	private onDrag(e: {delta: vec2; current: vec2}) {
		const newValue = [this.value[0] + e.delta[0], this.value[1] + e.delta[1]]

		const $knob = this.$refs.knob as HTMLElement
		this.dragFrom = getDOMCenter($knob)

		this.dragTo[0] = e.current[0] - this.knobOffset[0]
		this.dragTo[1] = e.current[1] - this.knobOffset[1]
		this.$emit('input', newValue)
	}
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.InputPoint
	position relative
	width var(--layout-input-height)
	height var(--layout-input-height)

.InputPoint__knob
	position relative
	top 15%
	left 15%
	width 70%
	height 70%
	border-radius 35%
	background var(--color-control)

	&:hover
		background var(--color-active)

	&:focus
		background var(--color-active)

	&.dragging
		z-index 200
		background var(--color-active)
		box-shadow 0 0 0 1px var(--color-active)

.InputPoint__icon
	position relative
	z-index 0
	width 100%
	height 100%

	.cross
		stroke-width 1px
		stroke var(--color-bg)

	.svg-ui
		position relative
		z-index 1000
</style>


