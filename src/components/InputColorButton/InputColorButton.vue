<template>
	<div class="InputColorButton" :class="{editing, selected}" :selectable="true">
		<button
			class="InputColorButton__button"
			@focus="onFocus"
			:style="previewStyles"
			@mousedown.right="onMousedownRight"
		/>
		<Popover class="InputColorButton__popover" :active.sync="editing" placement="right-start">
			<div class="InputColorButton__popover-content">
				<InputColorPicker
					class="InputColorButton__color-picker"
					:value="value"
					@input="$listeners.input"
				/>
				<div class="InputColorButton__parameters">
					<InputDropdown
						class="InputColorButton__mode simple"
						:value="value.mode"
						:values="['hsv', 'hsl', 'rgb', 'hex']"
						:labels="['HSV', 'HSL', 'RGB', 'HEX']"
						@input="convertMode"
					/>
					<InputColor
						class="InputColorButton__elements"
						:value="value"
						:showLabel="false"
						@input="$listeners.input"
					/>
				</div>
			</div>
		</Popover>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject} from 'vue-property-decorator'
import colorConvert from 'color-convert'

import Color, {ColorMode} from '../../data/Color'

import InputColor from '../InputColor'
import InputColorPicker from '../InputColorPicker'
import InputDropdown from '../InputDropdown'
import Popover from '../common/Popover.vue'
import SelectionManager from '../SelectionManager.vue'
import {buttons} from 'mouse-event'

@Component({
	components: {
		Popover,
		InputColor,
		InputColorPicker,
		InputDropdown
	}
})
export default class InputColorButton extends Vue {
	public selected: boolean = false

	@Prop({type: Object, required: true}) private value!: Color

	@Inject({from: 'SelectionManager', default: null})
	private readonly SelectionManager!: SelectionManager

	private editing: boolean = false

	private get previewStyles(): object {
		return {background: this.value.cssColor}
	}

	public updateValue(newValue: Color) {
		if (newValue.__ob__) {
			newValue.__ob__.dep.notify()
		}
		this.$emit('input', newValue)
	}

	private onMousedownRight(e: Event) {
		e.preventDefault()
	}

	private onFocus(e: Event) {
		this.editing = true
		if (this.SelectionManager) {
			this.SelectionManager.add(this, 'color')
		}
	}

	private convertMode(mode: ColorMode) {
		const newValue = this.value.convertMode(mode)
		if (newValue.__ob__) {
			newValue.__ob__.dep.notify()
		}
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

.InputColorButton
	position relative
	width var(--layout-input-height)
	height var(--layout-input-height)

	&__button
		position relative
		display block
		input-border-style()
		width 100%
		height 100%

		&:hover
			input-border-hover-style()

		^[0].editing &, ^[0].selected &, &:active
			input-border-focus-style()

	&__popover
		margin-left 0.3em
		padding var(--layout-popover-padding)
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

