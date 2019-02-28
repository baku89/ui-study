<template>
	<div class="InputColorButton">
		<div class="InputColorButton__preview" @click="isPopoverOpen = true" :style="previewStyles"/>
		<Popover
			class="InputColorButton__popover popper"
			:active.sync="isPopoverOpen"
			placement="right-start"
		>
			<div class="popper__arrow"/>
			<div class="InputColorButton__popover-content">
				<InputColorPicker class="InputColorButton__color-picker" :value="value" @input="onInput"/>
				<div class="InputColorButton__parameters">
					<InputDropdown
						class="InputColorButton__mode"
						theme="simple"
						:value="value[0]"
						:values="['hsl', 'rgb', 'hex']"
						:labels="['HSL', 'RGB', 'HEX']"
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
import {Component, Prop, Vue} from 'vue-property-decorator'
import colorConvert from 'color-convert'

import {toCSSColor, convertColorElements} from '@/util'
import {DataColor, DataColorMode, DataColorElements} from '@/data'

import InputColor from './InputColor'
import InputColorPicker from './InputColorPicker.vue'
import InputDropdown from './InputDropdown.vue'
import Popover from '@/components/common/Popover.vue'

@Component({
	components: {
		Popover,
		InputColor,
		InputColorPicker,
		InputDropdown
	}
})
export default class InputColorButton extends Vue {
	@Prop([Array]) private value!: DataColor

	private isPopoverOpen: boolean = false

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

	private onChangeMode(mode: DataColorMode) {
		const newElements = convertColorElements(this.mode, mode, this.elements)
		const newValue = [mode, newElements]

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
	width $input-height
	height $input-height

.InputColorButton__preview
	position relative
	display block
	input-border-style()
	width 100%
	height 100%

	&:hover
		input-border-hover-style()

	&:active
		input-border-focus-style()

.InputColorButton__popover
	margin-left 0.3em
	width 20em
	border 1px solid var(--color-border-text)
	border-radius $border-radius
	background var(--color-bg)
	box-shadow 0 0 1em 0 rgba(black, 0.1)

.InputColorButton__popover-content
	position relative
	margin 0.5em

.InputColorButton__color-picker
	margin-bottom 0.3em

.InputColorButton__parameters
	display flex

.InputColorButton__mode
	margin-right 0.3em
	width 4.5em

.InputColorButton__elements
	width 100%
</style>

