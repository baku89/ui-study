<template>
	<div
		class="InputNumber"
		:selectable="true"
		:editing="isEditing"
		:selected="isSelected"
		:updating="isDragging || updatedRecently"
	>
		<Drag
			:minDragDistance="3"
			detectDirection="horizontal"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="onDragend"
			@click="onClick"
		>
			<div class="InputNumber__display">
				<div class="InputNumber__label" v-if="label">{{this.label}}</div>
				{{displayValue}}
				<span v-if="unit" class="InputNumber__unit">{{unit}}</span>
			</div>
		</Drag>
		<input
			class="InputNumber__input"
			type="text"
			:value="value.toString()"
			@focus="onFocus"
			@change="onChange"
			@blur="onBlur"
			@keydown="onKeydown"
			ref="input"
		>
		<Portal v-if="isDragging">
			<svg class="svg-overlay">
				<SvgArrow :from="dragFrom" :to="dragTo"></SvgArrow>
				<line
					v-if="min !== undefined"
					class="narrow-stroke"
					:x1="dragMinX"
					:y1="dragFrom[1] - 16"
					:x2="dragMinX"
					:y2="dragFrom[1] + 16"
				></line>
				<line
					v-if="max !== undefined"
					class="narrow-stroke"
					:x1="dragMaxX"
					:y1="dragFrom[1] - 16"
					:x2="dragMaxX"
					:y2="dragFrom[1] + 16"
				></line>
			</svg>
		</Portal>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'
import {parseNumber, toFixed, quantize} from '../math'
import {getDOMCenter, keypressed, MouseDragEvent} from '../util'
import {vec2} from 'gl-matrix'
import keycode from 'keycode'

import Drag from './common/Drag'
import Portal from './common/Portal'
import SvgArrow from './common/SvgArrow.vue'
import SelectionManager from './SelectionManager.vue'

@Component({
	components: {
		Drag,
		Portal,
		SvgArrow
	}
})
export default class InputNumber extends Vue {
	public isSelected: boolean = false

	@Prop({type: Number, required: true}) private value!: number
	@Prop({type: Number, default: 1}) private precision!: number
	@Prop(String) private label!: string
	@Prop(String) private unit!: string
	@Prop(Number) private min!: number
	@Prop(Number) private max!: number
	@Prop(Number) private step!: number

	private isEditing: boolean = false
	private isDragging: boolean = false
	private dragFrom: number[] = [0, 0]
	private dragTo: number[] = [0, 0]
	private dragMinX: number = 0
	private dragMaxX: number = 0

	private shouldOmitZero: boolean = true
	private updatedRecently: boolean = false
	private updatedTimer!: number

	@Inject({from: 'SelectionManager', default: null})
	private readonly SelectionManager!: SelectionManager

	@Inject({from: 'dragSpeed', default: 0.5}) private readonly dragSpeed!: number
	@Inject({from: 'keyFaster', default: 'shift'})
	private readonly keyFaster!: string
	@Inject({from: 'keySlower', default: 'alt'})
	private readonly keySlower!: string

	private get displayValue(): string {
		return toFixed(this.value, this.precision, this.shouldOmitZero)
	}

	private get hasMin(): boolean {
		return this.min !== undefined
	}

	private get hasMax(): boolean {
		return this.max !== undefined
	}

	private get hasStep(): boolean {
		return this.step !== undefined
	}

	private onChange() {
		const input = this.$refs.input as HTMLInputElement
		const strValue: string = input.value
		const newValue: number = parseNumber(strValue)

		if (isNaN(newValue)) {
			input.value = this.value.toString()
		} else {
			this.updateValue(newValue)
		}

		this.isEditing = false
	}

	private updateValue(newValue: number) {
		if (this.hasMin) {
			newValue = Math.max(this.min, newValue)
		}
		if (this.hasMax) {
			newValue = Math.min(this.max, newValue)
		}
		if (this.hasStep) {
			newValue = quantize(newValue, this.step)
		}
		this.$emit('input', newValue)
	}

	private onClick() {
		const input = this.$refs.input as HTMLInputElement
		input.focus()
		input.select()
		this.isEditing = true
		// window.addEventListener('mousedown', this.forceChangeOnClickOutside)
	}

	// private forceChangeOnClickOutside(e: Event) {
	// 	console.log('asdfsf')
	// 	if (e.target !== this.$refs.input) {
	// 		console.log('thau')
	// 		this.onChange()
	// 		window.removeEventListener('mousedown', this.forceChangeOnClickOutside)
	// 	}
	// }

	private onFocus(e: Event) {
		this.isEditing = true
		this.SelectionManager!.add(this)
	}

	private onBlur() {
		this.isEditing = false
		this.onChange()
	}

	private onKeydown(e: KeyboardEvent) {
		const key = keycode(e)

		if (key === 'up' || key === 'down') {
			let inc = key === 'up' ? 1 : -1

			if (this.hasStep) {
				inc *= this.step
			} else if (keypressed(this.keyFaster)) {
				inc *= 10
			} else if (keypressed(this.keySlower)) {
				inc /= 10
			}

			let newValue = this.value + inc

			if (this.hasMin) {
				newValue = Math.max(this.min, newValue)
			}
			if (this.hasMax) {
				newValue = Math.min(this.max, newValue)
			}
			this.$emit('input', newValue)
		}
	}

	private onDragstart({current}: MouseDragEvent) {
		this.$set(this.dragFrom, 0, current[0])
		this.$set(this.dragTo, 0, current[0])
		this.$set(
			this.dragFrom,
			1,
			getDOMCenter(this.$refs.input as HTMLElement)[1]
		)
		this.$set(this.dragTo, 1, this.dragFrom[1])

		if (this.hasMin) {
			this.dragMinX = current[0] + (this.min - this.value) / this.dragSpeed
		}
		if (this.hasMax) {
			this.dragMaxX = current[0] + (this.max - this.value) / this.dragSpeed
		}

		this.isDragging = true
	}

	private onDrag(e: MouseDragEvent) {
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
			newValue = this.value + e.delta[0] * this.dragSpeed
		}

		if (this.hasStep) {
			newValue = quantize(newValue as number, this.step)
		}

		this.$set(this.dragTo, 0, x)
		this.$emit('input', newValue)
	}

	private onDragend() {
		this.isDragging = false
	}

	@Watch('value')
	private onValueChanged() {
		if (this.updatedRecently) {
			this.shouldOmitZero = false
		}
		this.updatedRecently = true
		clearTimeout(this.updatedTimer)

		// @ts-ignore
		this.updatedTimer = setTimeout(() => {
			this.updatedRecently = false
			this.shouldOmitZero = true
		}, 100)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.InputNumber
	input-border-style()
	position relative
	background var(--color-field)

	&:hover
		z-index 1
		input-border-hover-style()

	&[editing], &[selected], &[updating]
		z-index 2
		input-border-focus-style()

	&__display, &__input
		input-field-style()
		width 100%
		height 100%
		text-align right
		font-family var(--font-monospace)

	&__display
		position absolute
		top 0
		left 0
		z-index 5
		overflow hidden

		^[0][editing] > &
			visibility hidden

	&__label
		position absolute
		margin-left -0.05em
		height 100%
		color var(--color-border-text)
		font-size 0.9em
		line-height calc(var(--input-height) * 1.1)

	&__unit
		margin-right -0.1em
		margin-left -0.1em
		color var(--color-border-text)
		font-size 1em

	&__input
		opacity 0

		^[0][editing] > &
			opacity 1
</style>

