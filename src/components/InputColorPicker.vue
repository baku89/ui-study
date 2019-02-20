<template>
	<div :class="{InputColorPicker__root: true, dragging: isDragging}">
		<Draggable
			class="InputColorPicker__draggable"
			@dragstart="onDrag"
			@drag="onDrag"
			@dragend="onDrag"
		>
			<GradientPalette
				class="InputColorPicker__gradient-palette"
				:color="gradientPaletteColor"
				:varyings="[1, 2]"
			/>
			<div class="InputColorPicker__preview" :style="GradientPalettePreviewStyle"/>
		</Draggable>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'
import {clamp} from '@/math'
import mezr from 'mezr'

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

	private isDragging: boolean = false

	get mode(): DataColorMode {
		return this.value[0]
	}

	get elements(): DataColorElements {
		return this.value[1]
	}

	get hsl(): number[] {
		if (this.mode === 'hsl') {
			return this.elements as number[]
		} else {
			return convertColorElements(this.mode, 'hsl', this.elements) as number[]
		}
	}

	get cssColor(): string {
		return toCSSColor(this.value)
	}

	get GradientPalettePreviewStyle(): object {
		const hsl = this.hsl
		return {
			left: `${hsl[1]}%`,
			top: `${100 - hsl[2]}%`,
			background: this.cssColor
		}
	}

	get gradientPaletteColor(): DataColor {
		if (this.mode === 'hsl') {
			return this.value
		} else {
			return ['hsl', convertColorElements(this.mode, 'hsl', this.elements)]
		}
	}

	private onDrag(e: {
		current: vec2
		currentTarget: HTMLElement
		eventName: string
	}) {
		if (e.eventName === 'dragstart') {
			this.isDragging = true
		} else if (e.eventName === 'dragend') {
			this.isDragging = false
		}

		const {left, top} = mezr.rect(e.currentTarget)
		const width = e.currentTarget.clientWidth
		const height = e.currentTarget.clientHeight

		const x = clamp((e.current[0] - left) / width, 0, 1)
		const y = clamp(1 - (e.current[1] - top) / height, 0, 1)
		const newHSL = [this.hsl[0], x * 100, y * 100]
		const newElements = convertColorElements('hsl', this.mode, newHSL)

		const newValue = [this.mode, newElements]

		this.$emit('input', newValue)
	}
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.InputColorPicker__root
	position relative
	border 1px solid var(--color-border)
	border-radius $border-radius

.InputColorPicker__draggable
	width 100%
	height 100%

	.InputColorPicker__wrapper.dragging > &
		overflow visible
		cursor none

.InputColorPicker__gradient-palette
	position relative
	width 100%
	height 100%
	border-radius $border-radius

.InputColorPicker__preview
	position absolute
	margin -0.5em 0 0 -0.5em
	width 1em
	height 1em
	border 1px solid var(--color-border)
	border-radius 50%
	background red

	.InputColorPicker__wrapper.dragging &
		z-index 1000
		margin-top -0.5 * $color-preview-size
		margin-left -0.5 * $color-preview-size
		width $color-preview-size
		height $color-preview-size
</style>

