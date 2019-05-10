<template>
	<div
		class="InputNumber"
		:selectable="true"
		:class="{editing, selected, updating: dragging || updatedRecently}"
	>
		<Drag
			:dragging.sync="dragging"
			:minDragDistance="3"
			detectDirection="horizontal"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="onDragend"
			@click="onClick"
		>
			<div class="InputNumber__display">
				<div class="InputNumber__prefix" v-if="prefix">{{this.prefix}}</div>
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
			@blur="onBlur"
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
import {parseNumber, toFixed, quantize, clamp} from '../math'
import {getDOMCenter, MouseDragEvent} from '../util'
import {vec2} from 'gl-matrix'
import keycode from 'keycode'

import {ConfigDefault} from '../core/config'
import BindManager from '../manager/BindManager'

import Drag from './common/Drag'
import Portal from './common/Portal'
import SelectionManager from './SelectionManager.vue'
import SvgOverlayHorizontalDrag from './common/SvgOverlayHorizontalDrag.vue'

@Component({
	components: {
		Drag,
		Portal,
		SvgOverlayHorizontalDrag
	}
})
export default class InputNumber extends Vue {
	public selected: boolean = false

	@Prop({type: Number, required: true}) private value!: number
	@Prop({type: Number, default: 1}) private precision!: number
	@Prop(String) private prefix!: string
	@Prop(String) private unit!: string
	@Prop(Number) private min!: number
	@Prop(Number) private max!: number
	@Prop(Number) private step!: number
	@Prop({type: Boolean, default: false}) private showSign!: boolean

	private startValue!: number
	private inputValue!: string

	private editing: boolean = false
	private dragging: boolean = false

	private drag = {
		position: [0, 0],
		inc: 0,
		speed: 'normal',
		text: ''
	}

	private shouldOmitZero: boolean = true
	private updatedRecently: boolean = false
	private updatedTimer!: number

	@Inject({from: 'SelectionManager', default: null})
	private readonly SelectionManager!: SelectionManager

	@Inject({from: 'Config', default: ConfigDefault})
	private readonly Config!: any

	private created() {
		this.startValue = this.value
		this.inputValue = this.value.toString()
	}

	private get displayValue(): string {
		let displayValue = toFixed(this.value, this.precision, this.shouldOmitZero)
		if (this.showSign && this.value > 0) {
			displayValue = '+' + displayValue
		}
		return displayValue
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

	private onBlur() {
		this.editing = false
		this.notifyChanged()
	}

	private getConstrainedValue(newValue: number) {
		if (this.hasMin) {
			newValue = Math.max(this.min, newValue)
		}
		if (this.hasMax) {
			newValue = Math.min(this.max, newValue)
		}
		if (this.hasStep) {
			newValue = quantize(newValue, this.step)
		}
		return newValue
	}

	private updateValue(newValue: number) {
		newValue = this.getConstrainedValue(newValue)
		if (this.value !== newValue) {
			this.$emit('input', newValue)
		}
	}

	private notifyStartChange() {
		this.startValue = this.value
		this.$emit('startChange')
	}

	private notifyChanged() {
		this.$emit('change', this.value, this.startValue)
	}

	private onClick() {
		const input = this.$refs.input as HTMLInputElement
		input.focus()
		input.select()
		this.editing = true
	}

	private onFocus(e: Event) {
		this.editing = true
		if (this.SelectionManager) {
			this.SelectionManager.add(this)
		}
		this.notifyStartChange()
	}

	private onKeydown(e: KeyboardEvent) {
		const key = keycode(e)

		if (key === 'up' || key === 'down') {
			let inc = key === 'up' ? 1 : -1

			if (this.hasStep) {
				inc *= this.step
			} else if (BindManager.pressed(this.Config.keyFaster)) {
				inc *= 10
			} else if (BindManager.pressed(this.Config.keySlower)) {
				inc /= 10
			}

			const newValue = this.value + inc
			this.updateValue(newValue)
		}
	}

	private onDragstart({current}: MouseDragEvent) {
		const {drag} = this

		this.notifyStartChange()
		drag.inc = 0
		this.$set(drag.position, 0, current[0])
		this.$set(drag.position, 1, current[1])
	}

	private onDrag({delta, current}: MouseDragEvent) {
		const {drag} = this

		drag.speed = BindManager.pressed(this.Config.keyFaster)
			? 'fast'
			: !BindManager.pressed(this.Config.keySlower)
			? 'normal'
			: 'slow'

		const multiplier =
			drag.speed === 'fast' ? 10 : drag.speed === 'normal' ? 1 : 0.1

		drag.inc += delta[0] * this.Config.dragSpeed * multiplier
		this.$set(drag.position, 0, current[0])
		this.$set(drag.position, 1, current[1])

		const newValue = this.getConstrainedValue(this.startValue + drag.inc)

		const actualInc = newValue - this.startValue
		this.drag.text =
			(actualInc > 0 ? '+' : '') + actualInc.toFixed(this.precision)

		this.$emit('input', newValue)
	}

	private onDragend() {
		this.notifyChanged()
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
	input-placement-modifier-root()
	input-placement-modifier-border()
	position relative
	background var(--color-field)

	&:hover
		input-border-hover-style()

	&.editing, &.selected, &.updating
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

		^[0].editing > &
			visibility hidden

	&__prefix
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

		^[0].editing > &
			opacity 1
</style>

