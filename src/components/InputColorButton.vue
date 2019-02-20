<template>
	<div class="wrapper">
		<div class="preview" @click="openPicker" :style="previewStyle"/>
		<div v-if="isPopupOpen" class="popup" ref="popup">
			<div class="popup-content">
				<div class="color-picker-wrapper">
					<InputColorPicker class="color-picker" :value="value" @input="onInput"/>
				</div>
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

import {toCSSColor, convertColorElements} from '@/util'
import {DataColor, DataColorMode, DataColorElements} from '@/data'

import InputColor from './InputColor'
import InputColorPicker from './InputColorPicker.vue'
import InputDropdown from './InputDropdown.vue'

@Component({
	components: {
		InputColor,
		InputColorPicker,
		InputDropdown
	}
})
export default class InputColorButton extends Vue {
	@Prop([Array]) private value!: DataColor

	private isPopupOpen: boolean = false

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

	get hsl(): number[] {
		if (this.mode === 'hsl') {
			return this.elements as number[]
		} else {
			return convertColorElements(this.mode, 'hsl', this.elements) as number[]
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

.color-picker-wrapper
	position relative
	margin-bottom 0.3em
	padding-top 100%
	height 0

.color-picker
	position absolute
	top 0
	left 0
	width 100%
	height 100%

.parameters
	display flex

.color-mode
	margin-right 0.3em
	width 4.5em

.input-color
	width 100%
</style>

