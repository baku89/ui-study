<template>
	<div class="InputColorPicker">
		<Drag
			:dragging.sync="draggingSB"
			measure="normalized"
			:clamp="true"
			@dragstart="onDragSB('dragstart', $event)"
			@drag="onDragSB('drag', $event)"
			@dragend="onDragSB('dragend', $event)"
		>
			<div class="InputColorPicker__sv" :class="{dragging: draggingSB}">
				<div class="InputColorPicker__sv-inner">
					<GradientPalette class="InputColorPicker__palette" :color="hsb" :varyings="[1, 2]"/>
					<div class="InputColorPicker__sv-preview" :style="previewStylesSB"/>
				</div>
			</div>
		</Drag>
		<Drag
			:dragging.sync="draggingHue"
			measure="normalized"
			detectDirection="vertical"
			:clamp="true"
			@dragstart="onDragHue('dragstart', $event)"
			@drag="onDragHue('drag', $event)"
			@dragend="onDragHue('dragend', $event)"
		>
			<div class="InputColorPicker__hue" :class="{dragging: draggingHue}">
				<GradientPalette class="InputColorPicker__palette" :color="hsb" :varyings="[0]"/>
				<div class="InputColorPicker__hue-preview" :style="previewStylesHue"/>
			</div>
		</Drag>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'
import {clamp} from '../math'

import Color, {ColorMode, ColorElements} from '../data/Color'
import {MouseDragEvent} from '../util'

import GradientPalette from './common/GradientPalette'
import Drag from './common/Drag'

type DragEventType = 'dragstart' | 'drag' | 'dragend'

@Component({
	components: {
		GradientPalette,
		Drag
	}
})
export default class InputColorPicker extends Vue {
	@Prop({type: Object, required: true}) private value!: Color

	private draggingSB: boolean = false
	private draggingHue: boolean = false

	private cachedHSB = [-1, -1, -1]
	private previewStylesHue = {}
	private previewStylesSB = {}

	private get isHSB(): boolean {
		const mode = this.value.mode
		return mode === 'hsv' || mode === 'hsl'
	}

	private get hsb(): Color {
		return this.isHSB ? this.value : Color.convertMode(this.value, 'hsv')
	}

	private get cssColor(): string {
		return this.value.cssColor
	}

	@Watch('value', {immediate: true})
	private updatePreviewStyles() {
		const [h, s, b] = this.hsb.elements as number[]
		const [h0, s0, b0] = this.cachedHSB

		if (h % 360 !== h0 % 360 || s !== s0 || b !== b0) {
			this.previewStylesHue = {
				top: `${(1 - h / 360) * 100}%`,
				background: this.cssColor
			}

			this.previewStylesSB = {
				left: `${s}%`,
				top: `${100 - b}%`,
				background: this.cssColor
			}
		}
		return
	}

	private onDragSB(type: DragEventType, e: MouseDragEvent) {
		const hsb = this.hsb.elements as number[]

		if (type !== 'dragend') {
			const s = e.current[0] * 100
			const b = (1 - e.current[1]) * 100
			this.emitNewValue(hsb[0], s, b)
		}
	}

	private onDragHue(type: DragEventType, e: MouseDragEvent) {
		const hsb = this.hsb.elements as number[]

		if (type !== 'dragend') {
			const h = (1 - e.current[1]) * 360
			this.emitNewValue(h, hsb[1], hsb[2])
		}
	}

	private emitNewValue(h: number, s: number, b: number) {
		const hsb = [h, s, b]

		this.previewStylesHue = {
			top: `${(1 - h / 360) * 100}%`,
			background: this.cssColor
		}

		this.previewStylesSB = {
			left: `${s}%`,
			top: `${100 - b}%`,
			background: this.cssColor
		}

		const newValue = this.hsb.clone()
		newValue.elements = hsb
		if (!this.isHSB) {
			newValue.convertMode(this.value.mode)
		}

		this.cachedHSB = hsb

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

