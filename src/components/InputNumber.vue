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
			@dragend="isDragging = false"
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
			v-model="inputValue"
			@focus="onFocus"
			@change="onChange"
			@blur="isEditing = false"
			@keydown="onKeydown"
			ref="input"
		>
		<Portal v-if="isDragging">
			<svg class="svg-overlay">
				<SvgOverlayHorizontalDrag
					:position="drag.position"
					:to-right="drag.inc > 0"
					:speed="drag.speed"
					:text="drag.text"
				></SvgOverlayHorizontalDrag>
				<!-- <SvgArrow :from="dragFrom" :to="dragTo"></SvgArrow>
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
				></line>-->
			</svg>
		</Portal>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'
import {parseNumber, toFixed, quantize, clamp} from '../math'
import {getDOMCenter, keypressed, MouseDragEvent} from '../util'
import {vec2} from 'gl-matrix'
import keycode from 'keycode'

import {DataConfig, DefaultConfig} from '../core'

import Drag from './common/Drag'
import Portal from './common/Portal'
// import SvgArrow from './common/SvgArrow.vue'
import SelectionManager from './SelectionManager.vue'
import SvgOverlayHorizontalDrag from './common/SvgOverlayHorizontalDrag.vue'

@Component({
	components: {
		Drag,
		Portal,
		// SvgArrow,
		SvgOverlayHorizontalDrag
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

	private inputValue: string = this.value.toString()

	private isEditing: boolean = false
	private isDragging: boolean = false

	private drag = {
		position: [0, 0],
		startValue: 0,
		inc: 0,
		speed: 'normal',
		text: ''
	}

	/*
	private dragFrom: number[] = [0, 0]
	private dragTo: number[] = [0, 0]
	private dragMinX: number = 0
	private dragMaxX: number = 0
	*/

	private shouldOmitZero: boolean = true
	private updatedRecently: boolean = false
	private updatedTimer!: number

	@Inject({from: 'SelectionManager', default: null})
	private readonly SelectionManager!: SelectionManager

	@Inject({from: 'Config', default: DefaultConfig})
	private readonly Config!: DataConfig

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

	@Watch('value')
	private setInputValue() {
		this.inputValue = this.value.toString()
	}

	private onChange() {
		const newValue: number = parseNumber(this.inputValue)

		if (isNaN(newValue)) {
			this.setInputValue()
		} else {
			this.updateValue(newValue)
		}
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
		if (this.value !== newValue) {
			this.$emit('input', newValue)
		}
	}

	private onClick() {
		const input = this.$refs.input as HTMLInputElement
		input.focus()
		input.select()
		this.isEditing = true
	}

	private onFocus(e: Event) {
		this.isEditing = true
		if (this.SelectionManager) {
			this.SelectionManager.add(this)
		}
	}

	private onKeydown(e: KeyboardEvent) {
		const key = keycode(e)

		if (key === 'up' || key === 'down') {
			let inc = key === 'up' ? 1 : -1

			if (this.hasStep) {
				inc *= this.step
			} else if (keypressed(this.Config.keyFaster)) {
				inc *= 10
			} else if (keypressed(this.Config.keySlower)) {
				inc /= 10
			}

			let newValue = this.value + inc
			this.updateValue(newValue)
		}
	}

	private onDragstart({current}: MouseDragEvent) {
		const {drag} = this

		drag.startValue = this.value
		drag.inc = 0
		this.$set(drag.position, 0, current[0])
		this.$set(drag.position, 1, current[1])

		/*
		this.$set(this.dragFrom, 0, current[0])
		this.$set(this.dragTo, 0, current[0])
		this.$set(
			this.dragFrom,
			1,
			getDOMCenter(this.$refs.input as HTMLElement)[1]
		)
		this.$set(this.dragTo, 1, this.dragFrom[1])

		if (this.hasMin) {
			this.dragMinX =
				current[0] + (this.min - this.value) / this.Config.dragSpeed
		}
		if (this.hasMax) {
			this.dragMaxX =
				current[0] + (this.max - this.value) / this.Config.dragSpeed
		}
		*/

		this.isDragging = true
	}

	private onDrag({delta, current}: MouseDragEvent) {
		const {drag} = this

		drag.speed = keypressed(this.Config.keyFaster)
			? 'fast'
			: !keypressed(this.Config.keySlower)
			? 'normal'
			: 'slow'

		const multiplier =
			drag.speed === 'fast' ? 10 : drag.speed === 'normal' ? 1 : 0.1

		drag.inc += delta[0] * this.Config.dragSpeed * multiplier

		this.$set(drag.position, 0, current[0])
		this.$set(drag.position, 1, current[1])

		const newValue = drag.startValue + drag.inc
		this.updateValue(newValue)

		/*
		let newValue
		let x = e.current[0]

		if (this.hasMin || this.hasMax) {
			if (this.hasMin) {
				x = Math.max(this.dragMinX, x)
				newValue = this.min + (x - this.dragMinX) * this.Config.dragSpeed
			}
			if (this.hasMax) {
				x = Math.min(this.dragMaxX, x)
				newValue = this.max + (x - this.dragMaxX) * this.Config.dragSpeed
			}
		} else {
			newValue = this.value + e.delta[0] * this.Config.dragSpeed
		}

		if (this.hasStep) {
			newValue = quantize(newValue as number, this.step)
		}

		this.$set(this.dragTo, 0, x)
		this.$emit('input', newValue)
		*/
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

		if (this.isDragging) {
			const inc = this.value - this.drag.startValue
			this.drag.text = (inc > 0 ? '+' : '') + inc.toFixed(this.precision)
		}
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
		line-height calc(var(--layout-input-height) * 1.1)

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

