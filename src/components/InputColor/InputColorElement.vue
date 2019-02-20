<template>
	<div class="wrapper" :class="{editing: isEditing, dragging: isDragging}">
		<Draggable
			class="display"
			:minDragDistance="3"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="onDragend"
			@click="onClick"
		>
			<div class="label" v-if="label">{{this.label}}</div>
			{{element.toFixed(this.precision)}}
			<span v-if="unit" class="unit">{{unit}}</span>
		</Draggable>
		<input type="text" :value="element" @change="onChange" @blur="isEditing = false" ref="input">
		<div class="svg-overlay" v-if="isDragging">
			<div class="slit" :style="slitStyle"/>
			<div class="preview" :style="previewStyle"/>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'
import hexRgb from 'hex-rgb'

import {parseNumber} from '@/math'
import {getDOMCenter} from '@/util'
import {ratio, clamp, lerp} from '@/math'
import {DataColorMode, DataColorElements} from '@/data'
import {toCSSColor} from '@/util'

import Draggable from '@/components/common/Draggable.vue'
import SvgArrow from '@/components/common/SvgArrow.vue'

const SLIT_HEIGHT = 200
const SLIT_WIDTH = 6

@Component({
	components: {
		Draggable,
		SvgArrow
	}
})
export default class InputColorElement extends Vue {
	@Prop(Array) private value!: number[] | [string, number]
	@Prop(String) private mode!: DataColorMode
	@Prop(Number) private varying!: number
	@Prop({type: Number, default: 0}) private precision!: number
	@Prop(String) private label!: string
	@Prop(String) private unit!: string
	@Prop(Number) private min!: number
	@Prop(Number) private max!: number

	private isEditing: boolean = false
	private isDragging: boolean = false
	private slitMaxY: number = 0
	private slitMinY: number = 0
	private slitLeft: number = 0
	private previewY: number = 0
	private previewColor: string = ''

	get element(): number {
		return this.value[this.varying] as number
	}

	get slitStyle() {
		const numStep = 20
		let value: number[]
		let varying: number
		let mode: DataColorMode

		if (this.mode === 'hexa') {
			value = hexRgb(this.value[0] as string, {format: 'array'})
			value[3] = this.value[1] as number
			varying = 3
			mode = 'rgba'
		} else {
			value = Array.from(this.value) as number[]
			varying = this.varying
			mode = this.mode
		}
		const steps = []

		for (let i = 0; i <= numStep; i++) {
			const t = i / numStep
			value[varying] = lerp(this.min, this.max, t)
			const cssColor = toCSSColor([mode, value as DataColorElements])
			steps.push(`${cssColor} ${t * 100}%`)
		}

		const background = `linear-gradient(0deg, ${steps.join(', ')})`

		return {
			left: this.slitLeft - SLIT_WIDTH * 0.5 + 'px',
			top: this.slitMaxY - SLIT_WIDTH * 0.5 + 'px',
			height: this.slitMinY - this.slitMaxY + SLIT_WIDTH + 'px',
			background
		}
	}

	get previewStyle() {
		return {
			background: this.previewColor,
			left: `${this.slitLeft}px`,
			top: `${this.previewY}px`
		}
	}

	private onChange() {
		const input = this.$refs.input as HTMLInputElement
		const strValue: string = input.value
		let value: number = parseNumber(strValue)

		// If the new value is valid, fire input event.
		// Otherwise, reset the field with original value
		if (!isNaN(value)) {
			value = clamp(value, this.min, this.max)
			this.$emit('input', value)
		} else {
			input.value = this.element.toFixed(this.precision)
		}

		this.isEditing = false
	}

	private onClick() {
		const input = this.$refs.input as HTMLInputElement
		input.focus()
		input.select()
		this.isEditing = true

		const forceBlur = (e: Event) => {
			if (e.target !== input) {
				this.onChange()
				window.removeEventListener('mousedown', forceBlur)
			}
		}
		window.addEventListener('mousedown', forceBlur)
	}

	private onDragstart(e: {current: vec2}) {
		const position = ratio(this.element, this.min, this.max)

		this.slitMinY = e.current[1] + position * SLIT_HEIGHT
		this.slitMaxY = e.current[1] - (1 - position) * SLIT_HEIGHT
		this.slitLeft = getDOMCenter(this.$refs.input as HTMLElement)[0]
		this.previewY = e.current[1]
		this.isDragging = true
	}

	private onDrag(e: {current: vec2; delta: vec2}) {
		this.previewY = clamp(e.current[1], this.slitMaxY, this.slitMinY)
		const t = ratio(this.previewY, this.slitMinY, this.slitMaxY)
		const newValue = lerp(this.min, this.max, t)
		const newColorValue = Array.from(this.value)
		newColorValue[this.varying] = newValue
		this.previewColor = toCSSColor([
			this.mode,
			newColorValue as DataColorElements
		])

		this.$emit('input', newValue)
	}

	private onDragend() {
		this.isDragging = false
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

.wrapper
	input-border-style()
	position relative
	z-index 1
	background var(--color-field)

	&:hover
		z-index 2
		input-border-hover-style()

	&.editing, &.dragging
		z-index 2
		input-border-focus-style()

.display, input
	input-field-style()
	width 100%
	height 100%
	text-align right
	font-family var(--font-monospace)

.display
	position absolute
	top 0
	left 0
	z-index 5
	overflow hidden

	.editing > &
		visibility hidden

.label
	position absolute
	margin-left -0.05em
	height 100%
	color var(--color-border-text)
	font-size 0.9em
	line-height $input-height * (1 / @font-size)

.unit
	margin-right -0.1em
	margin-left -0.1em
	color var(--color-border-text)
	font-size 1em

input
	opacity 0

	.editing > &
		opacity 1

.slit
	position absolute
	width 3px
	height 100px
	border-radius 1.5px

.preview
	position absolute
	margin-top -0.5 * $color-preview-size
	margin-left -0.5 * $color-preview-size
	width $color-preview-size
	height $color-preview-size
	border-radius 50%
</style>

