<template>
	<div class="InputTime" :class="{editing, updating: dragging}">
		<Drag
			:dragging.sync="dragging"
			:minDragDistance="3"
			detectDirection="horizontal"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="this.activePartIndex = null"
			@click="onClick"
		>
			<div class="InputTime__display">
				<span
					class="InputTime__parts"
					:active="activePartIndex === 0"
					part="hours"
					partIndex="0"
					@mouseenter="onMouseenterPart(0)"
					@mouseleave="onMouseleavePart"
				>{{hours}}</span>
				<span>:</span>
				<span
					class="InputTime__parts"
					:active="activePartIndex === 1"
					part="minutes"
					partIndex="1"
					@mouseenter="onMouseenterPart(1)"
					@mouseleave="onMouseleavePart"
				>{{minutes}}</span>
				<span>:</span>
				<span
					class="InputTime__parts"
					:active="activePartIndex === 2"
					part="seconds"
					partIndex="2"
					@mouseenter="onMouseenterPart(2)"
					@mouseleave="onMouseleavePart"
				>{{seconds}}</span>
				<span>{{dropFrameSeparator}}</span>
				<span
					class="InputTime__parts"
					:active="activePartIndex === 3"
					part="frames"
					partIndex="3"
					@mouseenter="onMouseenterPart(3)"
					@mouseleave="onMouseleavePart"
				>{{frames}}</span>
			</div>
		</Drag>
		<input
			class="InputTime__input"
			type="text"
			:value="smpte"
			@focus="editing = true"
			@change="onChange"
			@blur="editing = false"
			@keydown="onKeydown"
			ref="input"
		>
		<Portal v-if="dragging">
			<svg class="svg-overlay">
				<SvgOverlayHorizontalDrag
					:position="drag.position"
					:to-right="drag.inc > 0"
					:speed="drag.speed"
					:text="drag.text"
				></SvgOverlayHorizontalDrag>
			</svg>
		</Portal>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'
import keycode from 'keycode'

import {getDOMCenter, MouseDragEvent} from '../../util'
import Timecode from '../../util/Timecode'
import {ConfigDefault} from '../../core/config'

import Drag from '../common/Drag'
import Portal from '../common/Portal'
// import SvgArrow from '../common/SvgArrow.vue'
import SvgOverlayHorizontalDrag from '../common/SvgOverlayHorizontalDrag.vue'
import {quantize} from '../../math'
import BindManager from '../../manager/BindManager'

@Component({
	components: {Drag, Portal, SvgOverlayHorizontalDrag}
})
export default class InputTime extends Vue {
	@Prop({type: Number, required: true}) private value!: number
	@Prop(Number) private min!: number
	@Prop(Number) private max!: number

	@Inject({from: 'fps', default: 24}) private readonly fps!: number
	@Inject({from: 'Config', default: ConfigDefault})
	private readonly Config!: any

	private smpte: string = ''
	private frames: string = '00'
	private dropFrameSeparator: string = ':'
	private seconds: string = '00'
	private minutes: string = '00'
	private hours: string = '00'

	private editing: boolean = false
	private activePartIndex: number | null = null

	private dragging: boolean = false
	private drag = {
		position: [0, 0],
		startValue: 0,
		inc: 0,
		speed: 'normal',
		text: ''
	}

	private timecode!: Timecode

	private get hasMin(): boolean {
		return this.min !== undefined
	}

	private get hasMax(): boolean {
		return this.max !== undefined
	}

	private created() {
		this.timecode = new Timecode(this.value, this.fps)
		this.onValueChanged(this.value)
	}

	@Watch('value')
	private onValueChanged(newValue: number) {
		this.timecode.frameCount = newValue

		this.smpte = this.timecode.smpte
		this.frames = this.timecode.framesText
		this.dropFrameSeparator = this.timecode.dropFrame ? ';' : ':'
		this.seconds = this.timecode.secondsText
		this.minutes = this.timecode.minutesText
		this.hours = this.timecode.hoursText
	}

	private onChange() {
		const input = this.$refs.input as HTMLInputElement
		const newSmpte: string = input.value

		try {
			this.timecode.smpte = newSmpte
		} catch (e) {
			this.smpte = this.timecode.smpte
			input.value = this.smpte
			return
		}

		let newValue = this.timecode.frameCount

		if (this.hasMin) {
			newValue = Math.max(this.min, newValue)
		}
		if (this.hasMax) {
			newValue = Math.min(this.max, newValue)
		}

		this.$emit('input', newValue)
	}

	private onKeydown(e: KeyboardEvent) {
		const key = keycode(e)

		if (key === 'up' || key === 'down') {
			e.preventDefault()
			let inc = key === 'up' ? 1 : -1

			// Calculate the partIndex by the selection
			const input = this.$refs.input as HTMLInputElement
			const beginning = input.value.substr(0, input.selectionStart || 0)
			const originalPartIndex = (beginning.match(/:|;/g) || []).length
			let partIndex = originalPartIndex

			if (partIndex === 3) {
				if (BindManager.pressed(this.Config.keyFaster)) {
					partIndex = 2
				}
			} else {
				if (BindManager.pressed(this.Config.keyFaster)) {
					inc *= 10
				} else if (BindManager.pressed(this.Config.keySlower)) {
					inc /= 10
				}
			}

			// Set the value to Timecode instance and get the frame count
			switch (partIndex) {
				case 0:
					this.timecode.hours += inc
					break
				case 1:
					this.timecode.minutes += inc
					break
				case 2:
					this.timecode.seconds += inc
					break
				case 3:
					this.timecode.frames += inc
					break
			}

			let newValue = this.timecode.frameCount

			// Clamp the frame count, then emit the event 'input'
			if (this.hasMin) {
				newValue = Math.max(this.min, newValue)
			}
			if (this.hasMax) {
				newValue = Math.min(this.max, newValue)
			}

			this.$nextTick().then(() => {
				this.setSelectionByPartIndex(originalPartIndex)
			})

			this.$emit('input', newValue)
		}
	}

	private onMouseenterPart(partIndex: number) {
		this.activePartIndex = partIndex
	}

	private onMouseleavePart() {
		if (!this.dragging) {
			this.activePartIndex = null
		}
	}

	private onDragstart({current}: MouseDragEvent) {
		const {drag} = this

		drag.startValue = this.value
		drag.inc = 0
		this.$set(drag.position, 0, current[0])
		this.$set(drag.position, 1, current[1])

		this.activePartIndex = 3
	}

	private onDrag({delta, current}: MouseDragEvent) {
		const {drag} = this

		drag.speed = BindManager.pressed(this.Config.keyFaster) ? 'fast' : 'normal'

		this.activePartIndex = drag.speed === 'fast' ? 2 : 3

		// TODO: Fix drop-frame
		const multiplier = drag.speed === 'fast' ? this.fps : 1

		drag.inc += delta[0] * this.Config.dragSpeed * multiplier

		this.$set(drag.position, 0, current[0])
		this.$set(drag.position, 1, current[1])

		let newValue =
			drag.startValue +
			(drag.speed === 'fast'
				? quantize(drag.inc, this.fps)
				: Math.round(drag.inc))

		if (this.hasMin) {
			newValue = Math.max(newValue, this.min)
		}

		if (this.hasMax) {
			newValue = Math.min(newValue, this.max)
		}

		const actualInc = newValue - drag.startValue
		drag.text = Timecode.formatIncrementalValue(
			actualInc,
			this.fps,
			drag.speed !== 'fast'
		)

		this.$emit('input', newValue)
	}

	private onClick(e: {originalEvent: MouseEvent}) {
		const input = this.$refs.input as HTMLInputElement

		const target = e.originalEvent.target as HTMLElement

		// Calculate the index and select only the part of SMPTE
		if (this.activePartIndex === null) {
			input.select()
		} else {
			this.setSelectionByPartIndex(this.activePartIndex)
		}

		input.focus()
		this.editing = true

		const forceChange = (evt: Event) => {
			if (evt.target !== input) {
				this.onChange()
				window.removeEventListener('mousedown', forceChange)
			}
		}
		window.addEventListener('mousedown', forceChange)
	}

	private setSelectionByPartIndex(partIndex: number) {
		const input = this.$refs.input as HTMLInputElement

		const start =
			this.smpte.split(/:|;/, partIndex).join(':').length +
			(partIndex === 0 ? 0 : 1)
		const end = this.smpte.split(/:|;/, partIndex + 1).join(':').length
		input.setSelectionRange(start, end)
	}
}
</script>

<style lang="stylus" scoped>
@import '../../style/config.styl'

.InputTime
	display flex
	input-border-style()
	position relative
	background var(--color-field)

	&:hover
		input-border-hover-style()

	&.editing, &.updating
		input-border-focus-style()

	&__display, &__input
		input-field-style()
		width 100%
		height 100%
		text-align center
		font-family var(--font-monospace)

	&__display
		position absolute
		top 0
		left 0
		z-index 5
		display flex
		justify-content center
		overflow hidden

		^[0].editing > &
			visibility hidden

	&__parts
		display block

		&[active]
			color var(--color-active)

	&__input
		opacity 0

		^[0].editing > &
			opacity 1
</style>
