<template>
	<div class="InputColorPicker">
		<Drag
			coord="normalized"
			:clamp="true"
			@dragstart="onDragSL('dragstart', $event)"
			@drag="onDragSL('drag', $event)"
			@dragend="onDragSL('dragend', $event)"
		>
			<div class="InputColorPicker__sl" :dragging="isDraggingSL">
				<div class="InputColorPicker__sl-inner">
					<GradientPalette
						class="InputColorPicker__palette"
						:color="gradientPaletteColor"
						:varyings="[1, 2]"
					/>
					<div class="InputColorPicker__sl-preview" :style="SLPreviewStyles"/>
				</div>
			</div>
		</Drag>
		<Drag
			coord="normalized"
			:clamp="true"
			@dragstart="onDragHue('dragstart', $event)"
			@drag="onDragHue('drag', $event)"
			@dragend="onDragHue('dragend', $event)"
		>
			<div class="InputColorPicker__hue" :dragging="isDraggingHue">
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
import {toCSSColor, convertColorElements} from '../util'

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

	private isDraggingSL: boolean = false
	private isDraggingHue: boolean = false

	private get mode(): DataColorMode {
		return this.value[0]
	}

	private get elements(): DataColorElements {
		return this.value[1]
	}

	private get hsl(): number[] {
		if (this.mode === 'hsl') {
			return this.elements as number[]
		} else {
			return convertColorElements(this.mode, 'hsl', this.elements) as number[]
		}
	}

	private get cssColor(): string {
		return toCSSColor(this.value)
	}

	private get SLPreviewStyles(): object {
		return {
			left: `${this.hsl[1]}%`,
			top: `${100 - this.hsl[2]}%`,
			background: this.cssColor
		}
	}

	private get HuePreviewStyles(): object {
		return {
			top: `${(1 - this.hsl[0] / 360) * 100}%`,
			background: this.cssColor
		}
	}

	private get gradientPaletteColor(): DataColor {
		if (this.mode === 'hsl') {
			return this.value
		} else {
			return ['hsl', convertColorElements(this.mode, 'hsl', this.elements)]
		}
	}

	private onDragSL(
		type: 'dragstart' | 'drag' | 'dragend',
		e: {current: vec2; eventName: string}
	) {
		if (type === 'dragstart') {
			this.isDraggingSL = true
		} else if (type === 'dragend') {
			this.isDraggingSL = false
		}

		if (type !== 'dragend') {
			const s = e.current[0] * 100
			const l = (1 - e.current[1]) * 100
			this.emitNewHSL(this.hsl[0], s, l)
		}
	}

	private onDragHue(
		type: 'dragstart' | 'drag' | 'dragend',
		e: {current: vec2; eventName: string}
	) {
		if (type === 'dragstart') {
			this.isDraggingHue = true
		} else if (type === 'dragend') {
			this.isDraggingHue = false
		}

		if (type !== 'dragend') {
			const h = (1 - e.current[1]) * 360
			this.emitNewHSL(h, this.hsl[1], this.hsl[2])
		}
	}

	private emitNewHSL(h: number, s: number, l: number) {
		const newElements = convertColorElements('hsl', this.mode, [h, s, l])
		const newValue = [this.mode, newElements]
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

	&__sl, &__hue
		overflow hidden
		box-sizing content-box
		border 1px solid var(--color-border)
		border-radius $border-radius

		&.dragging
			overflow visible
			cursor none

	&__sl
		position relative
		flex-grow 1

	&__sl-inner
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

	&__sl-preview, &__hue-preview
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

