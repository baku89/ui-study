<template>
	<div class="InputColorPicker">
		<Draggable
			:class="{InputColorPicker__sl: true, dragging: isDraggingSL}"
			coord="normalized"
			@dragstart="onDragSL"
			@drag="onDragSL"
			@dragend="onDragSL"
		>
			<div class="InputColorPicker__sl-inner">
				<GradientPalette
					class="InputColorPicker__palette"
					:color="gradientPaletteColor"
					:varyings="[1, 2]"
				/>
				<div class="InputColorPicker__sl-preview" :style="SLPreviewStyles"/>
			</div>
		</Draggable>
		<Draggable
			:class="{InputColorPicker__hue: true, dragging: isDraggingHue}"
			coord="normalized"
			@dragstart="onDragHue"
			@drag="onDragHue"
			@dragend="onDragHue"
		>
			<GradientPalette
				class="InputColorPicker__palette"
				:color="gradientPaletteColor"
				:varyings="[0]"
			/>
			<div class="InputColorPicker__hue-preview" :style="HuePreviewStyles"/>
		</Draggable>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'
import {clamp} from '@/math'

import {DataColor, DataColorMode, DataColorElements} from '@/data'
import {toCSSColor, convertColorElements} from '@/util'

import GradientPalette from '@/components/common/GradientPalette'
import Draggable from '@/components/common/Draggable.vue'

@Component({
	components: {
		GradientPalette,
		Draggable
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

	private onDragSL(e: {current: vec2; eventName: string}) {
		if (e.eventName === 'dragstart') {
			this.isDraggingSL = true
		} else if (e.eventName === 'dragend') {
			this.isDraggingSL = false
		}

		const s = e.current[0] * 100
		const l = (1 - e.current[1]) * 100
		this.emitNewHSL(this.hsl[0], s, l)
	}

	private onDragHue(e: {current: vec2; eventName: string}) {
		if (e.eventName === 'dragstart') {
			this.isDraggingHue = true
		} else if (e.eventName === 'dragend') {
			this.isDraggingHue = false
		}

		const h = (1 - e.current[1]) * 360
		this.emitNewHSL(h, this.hsl[1], this.hsl[2])
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

.InputColorPicker__sl, .InputColorPicker__hue
	overflow hidden
	box-sizing content-box
	border 1px solid var(--color-border)
	border-radius $border-radius

	&.dragging
		overflow visible
		cursor none

.InputColorPicker__sl
	position relative
	flex-grow 1

.InputColorPicker__sl-inner
	position relative
	padding-top 100%
	height 0

.InputColorPicker__hue
	position relative
	margin-left 0.3em
	width 1em

.InputColorPicker__palette
	position absolute
	top 0
	left 0
	width 100%
	height 100%
	border-radius $border-radius

.InputColorPicker__sl-preview, .InputColorPicker__hue-preview
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

.InputColorPicker__hue-preview
	left 50%
</style>

