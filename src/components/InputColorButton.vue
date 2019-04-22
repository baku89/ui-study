<template>
	<div class="InputColorButton" :selectable="true" :editing="isEditing" :selected="isSelected">
		<button class="InputColorButton__button" @focus="onFocus" :style="previewStyles"/>
		<Popover class="InputColorButton__popover" :active.sync="isEditing" placement="right-start">
			<div class="popper__arrow"/>
			<div class="InputColorButton__popover-content">
				<InputColorPicker class="InputColorButton__color-picker" :value="value" @input="onInput"/>
				<div class="InputColorButton__parameters">
					<InputDropdown
						class="InputColorButton__mode"
						theme="simple"
						:value="value[0]"
						:values="['hsv', 'hsl', 'rgb', 'hex']"
						:labels="['HSV', 'HSL', 'RGB', 'HEX']"
						@input="onChangeMode"
					/>
					<InputColor
						class="InputColorButton__elements"
						:value="value"
						:showLabel="false"
						@input="onInput"
					/>
				</div>
			</div>
		</Popover>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject} from 'vue-property-decorator'
import colorConvert from 'color-convert'

import {toCSSColor, convertColorElements} from '../util'
import {DataColor, DataColorMode, DataColorElements} from '../data'

import InputColor from './InputColor'
import InputColorPicker from './InputColorPicker.vue'
import InputDropdown from './InputDropdown.vue'
import Popover from '../components/common/Popover.vue'
import SelectionManager from './SelectionManager.vue'

@Component({
	components: {
		Popover,
		InputColor,
		InputColorPicker,
		InputDropdown
	}
})
export default class InputColorButton extends Vue {
	public isSelected: boolean = false

	@Prop([Array]) private value!: DataColor

	@Inject({from: 'SelectionManager', default: null})
	private readonly SelectionManager!: SelectionManager

	private isEditing: boolean = false

	get mode(): DataColorMode {
		return this.value[0]
	}

	get elements(): DataColorElements {
		return this.value[1]
	}

	get cssColor(): string {
		return toCSSColor(this.value)
	}

	get previewStyles(): object {
		return {background: this.cssColor}
	}

	get hsl(): number[] {
		if (this.mode === 'hsl') {
			return this.elements as number[]
		} else {
			return convertColorElements(this.mode, 'hsl', this.elements) as number[]
		}
	}

	private onFocus() {
		this.isEditing = true
		this.SelectionManager!.add(this, 'color')
	}

	private onChangeMode(mode: DataColorMode) {
		const newElements = convertColorElements(this.mode, mode, this.elements)
		const newValue = [mode, newElements]

		this.$emit('input', newValue)
	}

	private updateValue(newValue: DataColor) {
		this.$emit('input', newValue)
	}

	private onInput(color: DataColor) {
		this.$emit('input', color)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.InputColorButton
	position relative
	width var(--input-height)
	height var(--input-height)

	&__button
		position relative
		display block
		input-border-style()
		width 100%
		height 100%

		&:hover
			input-border-hover-style()

		^[0][editing] &, ^[0][selected] &, &:active
			input-border-focus-style()

	&__popover
		margin-left 0.3em
		width 20em
		border 1px solid var(--color-border-text)
		border-radius $border-radius
		background var(--color-bg)
		box-shadow 0 0 1em 0 rgba(black, 0.1)

	&__popover-content
		position relative
		margin 0.5em

	&__color-picker
		margin-bottom 0.3em

	&__parameters
		display flex

	&__mode
		margin-right 0.3em
		width 4.5em

	&__elements
		width 100%
</style>

