<template>
	<div class="InputColorPicker">
		<Drag
			measure="normalized"
			:clamp="true"
			@dragstart="onDragSV('dragstart', $event)"
			@drag="onDragSV('drag', $event)"
			@dragend="onDragSV('dragend', $event)"
		>
			<div class="InputColorPicker__sv" :class="{dragging: draggingSV}">
				<div class="InputColorPicker__sv-inner">
					<GradientPalette
						class="InputColorPicker__palette"
						:color="gradientPaletteColor"
						:varyings="[1, 2]"
					/>
					<div class="InputColorPicker__sv-preview" :style="SVPreviewStyles"/>
				</div>
			</div>
		</Drag>
		<Drag
			measure="normalized"
			detectDirection="vertical"
			:clamp="true"
			@dragstart="onDragHue('dragstart', $event)"
			@drag="onDragHue('drag', $event)"
			@dragend="onDragHue('dragend', $event)"
		>
			<div class="InputColorPicker__hue" :class="{dragging: draggingHue}">
				<GradientPalette
					class="InputColorPicker__palette"
					:color="gradientPaletteColor"
					:varyings="[0]"
				/>
				<div class="InputColorPicker__hue-preview" :style="HuePreviewStyles"/>
			</div>
		</Drag>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'
import {clamp} from '../math'

import {DataColor, DataColorMode, DataColorElements} from '../data'
import {toCSSColor, convertColorElements, MouseDragEvent} from '../util'

import GradientPalette from './common/GradientPalette'
import Drag from './common/Drag'

@Component({
	components: {
		GradientPalette,
		Drag
	}
})
export default class InputColorPicker extends Vue {
	@Prop([Array]) private value!: DataColor

	private draggingSV: boolean = false
	private draggingHue: boolean = false

	private get mode(): DataColorMode {
		return this.value[0]
	}

	private get elements(): DataColorElements {
		return this.value[1]
	}

	private get hsv(): number[] {
		if (this.mode === 'hsv' || this.mode === 'hsl') {
			return this.elements as number[]
		} else {
			return convertColorElements(this.mode, 'hsv', this.elements) as number[]
		}
	}

	private get cssColor(): string {
		return toCSSColor(this.value)
	}

	private get SVPreviewStyles(): object {
		return {
			left: `${this.hsv[1]}%`,
			top: `${100 - this.hsv[2]}%`,
			background: this.cssColor
		}
	}

	private get HuePreviewStyles(): object {
		return {
			top: `${(1 - this.hsv[0] / 360) * 100}%`,
			background: this.cssColor
		}
	}

	private get gradientPaletteColor(): DataColor {
		if (this.mode === 'hsv' || this.mode === 'hsl') {
			return this.value
		} else {
			return ['hsv', this.hsv]
		}
	}

	private onDragSV(type: 'dragstart' | 'drag' | 'dragend', e: MouseDragEvent) {
		if (type === 'dragstart') {
			this.draggingSV = true
		} else if (type === 'dragend') {
			this.draggingSV = false
		}

		if (type !== 'dragend') {
			const s = e.current[0] * 100
			const l = (1 - e.current[1]) * 100
			this.emitNewValue(this.hsv[0], s, l)
		}
	}

	private onDragHue(type: 'dragstart' | 'drag' | 'dragend', e: MouseDragEvent) {
		if (type === 'dragstart') {
			this.draggingHue = true
		} else if (type === 'dragend') {
			this.draggingHue = false
		}

		if (type !== 'dragend') {
			const h = (1 - e.current[1]) * 360
			this.emitNewValue(h, this.hsv[1], this.hsv[2])
		}
	}

	private emitNewValue(h: number, s: number, v: number) {
		let newValue: DataColor
		if (this.mode === 'hsv' || this.mode === 'hsl') {
			newValue = [this.mode, [h, s, v]]
		} else {
			const newElements = convertColorElements('hsv', this.mode, [h, s, v])
			newValue = [this.mode, newElements]
		}
		this.$emit('input', newValue)
	}
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.InputColorPicker
	position relative
	display flex
	user-select none

	&__sv, &__hue
		overflow hidden
		box-sizing content-box
		border 1px solid var(--color-border)
		border-radius $border-radius

		&.dragging
			overflow visible
			cursor none

	&__sv
		position relative
		flex-grow 1

	&__sv-inner
		position relative
		padding-top 100%
		height 0

	&__hue
		position relative
		margin-left 0.3em
		width 1em

	&__palette
		position absolute
		top 0
		left 0
		width 100%
		height 100%
		border-radius $border-radius

	&__sv-preview, &__hue-preview
		position absolute
		margin -0.5em 0 0 -0.5em
		width 1em
		height 1em
		border 1px solid var(--color-field)
		border-radius 50%
		box-shadow 0 0 0 0.5px var(--color-text)

		.dragging > * > &, .dragging > &
			z-index 1000
			margin-top -0.5 * $color-preview-size
			margin-left -0.5 * $color-preview-size
			width $color-preview-size
			height $color-preview-size
			border none
			box-shadow none

	&__hue-preview
		left 50%
</style>

