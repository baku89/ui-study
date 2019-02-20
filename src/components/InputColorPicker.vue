<template>
	<div class="wrapper">
		<div class="preview" @click="openPicker" :style="previewStyle"/>
		<div v-if="isPopupOpen" class="popup" ref="popup">
			<div class="popup-content">
				<Draggable
					:class="{'color-pad-wrapper': true, 'dragging': isDraggingColorPad}"
					@dragstart="onDragColorPad"
					@drag="onDragColorPad"
					@dragend="onDragColorPad"
				>
					<ColorPad class="color-pad" :color="colorPadColor" :varyings="[1, 2]" ref="pad"/>
					<div class="color-pad-preview" :style="colorPadPreviewStyle"/>
				</Draggable>
				<div class="parameters">
					<InputDropdown
						class="color-mode"
						theme="simple"
						:value="value[0]"
						:values="['hsl', 'rgb', 'hex']"
						:labels="['HSL', 'RGB', 'HEX']"
						@input="onChangeMode"
					/>
					<InputColor class="input-color" :value="value" @input="onInput"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import colorConvert from 'color-convert'
import {vec2} from 'gl-matrix'
import mezr from 'mezr'

import {clamp} from '@/math'
import {toCSSColor, convertColorElements} from '@/util'
import {DataColor, DataColorMode, DataColorElements} from '@/data'

import ColorPad from './ColorPad'
import Draggable from './common/Draggable.vue'
import InputColor from './InputColor'
import InputDropdown from './InputDropdown.vue'

@Component({
	components: {ColorPad, Draggable, InputColor, InputDropdown}
})
export default class InputColorPicker extends Vue {
	@Prop([Array]) private value!: DataColor

	private isPopupOpen: boolean = false
	private isDraggingColorPad: boolean = false

	get mode(): DataColorMode {
		return this.value[0]
	}

	get elements(): DataColorElements {
		return this.value[1]
	}

	get cssColor(): string {
		return toCSSColor(this.value)
	}

	get previewStyle(): object {
		return {background: this.cssColor}
	}

	get colorPadPreviewStyle(): object {
		const hsl = this.hsl
		return {
			left: `${hsl[1]}%`,
			top: `${100 - hsl[2]}%`,
			background: this.cssColor
		}
	}

	get hsl(): number[] {
		if (this.mode === 'hsl') {
			return this.elements as number[]
		} else {
			return convertColorElements(this.mode, 'hsl', this.elements) as number[]
		}
	}

	get colorPadColor(): DataColor {
		if (this.mode === 'hsl') {
			return this.value
		} else {
			return ['hsl', convertColorElements(this.mode, 'hsl', this.elements)]
		}
	}

	private openPicker() {
		this.isPopupOpen = true

		const closePicker = (e: Event) => {
			// @ts-ignore
			if (e.path.indexOf(this.$refs.popup) === -1) {
				this.isPopupOpen = false
				window.removeEventListener('mousedown', closePicker)
			}
		}
		window.addEventListener('mousedown', closePicker)
	}

	private onChangeMode(mode: DataColorMode) {
		const newElements = convertColorElements(this.mode, mode, this.elements)
		const newValue = [mode, newElements]

		this.$emit('input', newValue)
	}

	private onInput(color: DataColor) {
		this.$emit('input', color)
	}

	private onDragColorPad(e: {
		current: vec2
		currentTarget: HTMLElement
		eventName: string
	}) {
		if (e.eventName === 'dragstart') {
			this.isDraggingColorPad = true
		} else if (e.eventName === 'dragend') {
			this.isDraggingColorPad = false
		}

		const {left, top} = mezr.rect(e.currentTarget)
		const width = e.currentTarget.clientWidth
		const height = e.currentTarget.clientHeight

		const x = clamp((e.current[0] - left) / width, 0, 1)
		const y = clamp(1 - (e.current[1] - top) / height, 0, 1)
		const newHSL = [this.hsl[0], x * 100, y * 100]
		const newElements = convertColorElements('hsl', this.mode, newHSL)

		const newValue = [this.mode, newElements]

		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.wrapper
	position relative
	width $input-height
	height $input-height

.preview
	position relative
	display block
	input-border-style()
	width 100%
	height 100%

	&:hover
		input-border-hover-style()

	&:active
		input-border-focus-style()

.popup
	position fixed
	top 0
	left 0
	z-index 1000
	width 16em
	border 1px solid var(--color-border)
	border-radius $border-radius
	background var(--color-bg)
	box-shadow 0 0 10px 0 rgba(black, 0.1)

.popup-content
	position relative
	margin 0.3em

.color-pad-wrapper
	position relative
	overflow hidden
	margin-bottom 0.3em
	padding-top 100%
	height 0

	&.dragging
		overflow visible
		cursor none

.color-pad
	position absolute
	top 0
	left 0
	width 100%
	height 100%
	border 1px solid var(--color-border)
	border-radius $border-radius

.color-pad-preview
	position absolute
	margin -0.5em 0 0 -0.5em
	width 1em
	height 1em
	border 1px solid var(--color-border)
	border-radius 50%
	background red

	.color-pad-wrapper.dragging > &
		z-index 1000
		margin-top -0.5 * $color-preview-size
		margin-left -0.5 * $color-preview-size
		width $color-preview-size
		height $color-preview-size

.parameters
	display flex

.color-mode
	margin-right 0.3em
	width 4.5em

.input-color
	width 100%
</style>

