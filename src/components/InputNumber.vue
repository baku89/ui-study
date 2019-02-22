<template>
	<div class="InputNumber__root" :class="{editing: isEditing, dragging: isDragging}">
		<Draggable
			class="InputNumber__display"
			:minDragDistance="3"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="onDragend"
			@click="onClick"
		>
			<div class="InputNumber__label" v-if="label">{{this.label}}</div>
			{{value.toFixed(this.precision)}}
			<span v-if="unit" class="InputNumber__unit">{{unit}}</span>
		</Draggable>
		<input
			class="InputNumber__input"
			type="text"
			:value="value"
			@change="onChange"
			@blur="isEditing = false"
			ref="input"
		>
		<Portal>
			<svg class="svg-overlay" v-if="isDragging">
				<SvgArrow :from="dragFrom" :to="dragTo"></SvgArrow>
				<line
					v-if="min !== undefined"
					class="narrow-stroke"
					:x1="dragMinX"
					:y1="dragFrom[1] - 30"
					:x2="dragMinX"
					:y2="dragFrom[1] + 30"
				></line>
				<line
					v-if="max !== undefined"
					class="narrow-stroke"
					:x1="dragMaxX"
					:y1="dragFrom[1] - 30"
					:x2="dragMaxX"
					:y2="dragFrom[1] + 30"
				></line>
			</svg>
		</Portal>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject} from 'vue-property-decorator'
import {parseNumber} from '@/math'
import {getDOMCenter} from '@/util'
import {vec2} from 'gl-matrix'

import Draggable from './common/Draggable.vue'
import Portal from './common/Portal'
import SvgArrow from './common/SvgArrow.vue'

@Component({
	components: {
		Draggable,
		Portal,
		SvgArrow
	}
})
export default class InputNumber extends Vue {
	@Prop({type: Number, required: true}) private value!: number
	@Prop({type: Number, default: 1}) private precision!: number
	@Prop(String) private label!: string
	@Prop(String) private unit!: string
	@Prop(Number) private min!: number
	@Prop(Number) private max!: number

	private isEditing: boolean = false
	private isDragging: boolean = false
	private dragFrom: number[] = [0, 0]
	private dragTo: number[] = [0, 0]
	private dragMinX: number = 0
	private dragMaxX: number = 0

	@Inject({from: 'dragSpeed', default: 0.5}) private dragSpeed!: number

	private get hasMin() {
		return this.min !== undefined
	}

	private get hasMax() {
		return this.max !== undefined
	}

	private onChange() {
		const input = this.$refs.input as HTMLInputElement
		const strValue: string = input.value
		let value: number = parseNumber(strValue)

		if (isNaN(value)) {
			input.value = this.value.toFixed(this.precision)
		} else {
			if (this.hasMin) {
				value = Math.max(this.min, value)
			}
			if (this.hasMax) {
				value = Math.min(this.max, value)
			}
			this.$emit('input', value)
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
		this.$set(this.dragFrom, 0, e.current[0])
		this.$set(this.dragTo, 0, e.current[0])
		this.$set(
			this.dragFrom,
			1,
			getDOMCenter(this.$refs.input as HTMLElement)[1]
		)
		this.$set(this.dragTo, 1, this.dragFrom[1])

		if (this.hasMin) {
			this.dragMinX = e.current[0] + (this.min - this.value) / this.dragSpeed
		}
		if (this.hasMax) {
			this.dragMaxX = e.current[0] + (this.max - this.value) / this.dragSpeed
		}

		this.isDragging = true
	}

	private onDrag(e: {current: vec2; delta: vec2}) {
		let newValue
		let x = e.current[0]

		if (this.hasMin || this.hasMax) {
			if (this.hasMin) {
				x = Math.max(this.dragMinX, x)
				newValue = this.min + (x - this.dragMinX) * this.dragSpeed
			}
			if (this.hasMax) {
				x = Math.min(this.dragMaxX, x)
				newValue = this.max + (x - this.dragMaxX) * this.dragSpeed
			}
		} else {
			newValue = this.value + e.delta[0]
		}

		this.$set(this.dragTo, 0, x)
		this.$emit('input', newValue)
	}

	private onDragend() {
		this.isDragging = false
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.InputNumber__root
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

.InputNumber__display, .InputNumber__input
	input-field-style()
	width 100%
	height 100%
	text-align right
	font-family var(--font-monospace)

.InputNumber__display
	position absolute
	top 0
	left 0
	z-index 5
	overflow hidden

	.editing > &
		visibility hidden

.InputNumber__label
	position absolute
	margin-left -0.05em
	height 100%
	color var(--color-border-text)
	font-size 0.9em
	line-height $input-height * 1.1

.InputNumber__unit
	margin-right -0.1em
	margin-left -0.1em
	color var(--color-border-text)
	font-size 1em

.InputNumber__input
	opacity 0

	.InputNumber__root.editing > &
		opacity 1
</style>

