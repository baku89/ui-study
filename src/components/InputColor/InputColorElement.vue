<template>
	<div
		class="InputColorElement"
		:selectable="true"
		:editing="isEditing"
		:selected="isSelected"
		:updating="isDragging || updatedRecently"
	>
		<Drag
			:minDragDistance="3"
			detectDirection="vertical"
			@dragstart="onDragstart"
			@drag="onDrag"
			@dragend="onDragend"
			@click="onClick"
		>
			<div class="InputColorElement__display">
				<div class="InputColorElement__label" v-if="info.label[varying]">{{info.label[varying]}}</div>
				{{value.toFixed(0)}}
				<span
					v-if="info.unit[varying]"
					class="InputColorElement__unit"
				>{{info.unit[varying]}}</span>
			</div>
		</Drag>
		<input
			class="InputColorElement__input"
			type="text"
			:value="value"
			@focus="onFocus"
			@change="onChange"
			@blur="isEditing = false"
			@keydown="onKeydown"
			ref="input"
		>
		<Portal v-if="isDragging">
			<div class="svg-overlay">
				<GradientPalette
					class="InputColorElement__slit"
					:color="color"
					:varyings="[varying]"
					:style="slitStyles"
				/>
				<div class="InputColorElement__preview" :style="previewStyles"/>
			</div>
		</Portal>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch, Inject} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'
import keycode from 'keycode'

import {getDOMCenter, toCSSColor, keypressed} from '../../util'
import {parseNumber, ratio, clamp, lerp} from '../../math'
import {
	DataColorMode,
	DataColorElements,
	DataColor,
	DataColorInfo,
	DataColorModeInfo
} from '../../data'

import Drag from '../common/Drag'
import Portal from '../common/Portal'
import SvgArrow from '../common/SvgArrow.vue'
import GradientPalette from '../common/GradientPalette'
import SelectionManager from '../SelectionManager.vue'
import {DefaultConfig, DataConfig} from '../../core'

const SLIT_HEIGHT = 200
const SLIT_WIDTH = 6

@Component({
	components: {
		Drag,
		Portal,
		SvgArrow,
		GradientPalette
	}
})
export default class InputColorElement extends Vue {
	public isSelected: boolean = false

	@Prop(Array) private color!: DataColor
	@Prop(Number) private varying!: number

	private isEditing: boolean = false
	private isDragging: boolean = false
	private slitMaxY: number = 0
	private slitMinY: number = 0
	private slitLeft: number = 0
	private previewY: number = 0

	private updatedRecently: boolean = false
	private updatedTimer!: number

	@Inject({from: 'SelectionManager', default: null})
	private readonly SelectionManager!: SelectionManager

	@Inject({from: 'Config', default: DefaultConfig})
	private readonly Config!: DataConfig

	get mode(): DataColorMode {
		return this.color[0]
	}

	get value(): number {
		return this.color[1][this.varying] as number
	}

	get cssColor(): string {
		return toCSSColor(this.color)
	}

	get slitStyles() {
		return {
			left: this.slitLeft - SLIT_WIDTH * 0.5 + 'px',
			top: this.slitMaxY - SLIT_WIDTH * 0.5 + 'px',
			height: this.slitMinY - this.slitMaxY + SLIT_WIDTH + 'px'
		}
	}

	get previewStyles() {
		return {
			background: this.cssColor,
			left: `${this.slitLeft}px`,
			top: `${this.previewY}px`
		}
	}

	get info(): DataColorModeInfo {
		return DataColorInfo.get(this.mode)!
	}

	private onFocus(e: Event) {
		this.isEditing = true
		if (this.SelectionManager) {
			this.SelectionManager.add(this)
		}
	}

	private onChange() {
		const input = this.$refs.input as HTMLInputElement
		const newValue: number = parseNumber(input.value)

		// If the new value is valid, fire input event.
		// Otherwise, reset the field with original value
		if (!isNaN(newValue)) {
			this.updateValue(newValue)
		} else {
			input.value = this.value.toFixed(0)
		}

		this.isEditing = false
	}

	private updateValue(newValue: number) {
		newValue = clamp(newValue, 0, this.info.max[this.varying])
		this.$emit('update:element', newValue)
	}

	private onKeydown(e: KeyboardEvent) {
		const key = keycode(e)

		if (key === 'up' || key === 'down') {
			let inc = key === 'up' ? 1 : -1

			if (keypressed(this.Config.keyFaster)) {
				inc *= 10
			}
			this.updateValue(this.value + inc)
		}
	}

	private onClick() {
		const input = this.$refs.input as HTMLInputElement
		input.focus()
		input.select()
		this.isEditing = true

		const forceChange = (e: Event) => {
			if (e.target !== input) {
				this.onChange()
				window.removeEventListener('mousedown', forceChange)
			}
		}
		window.addEventListener('mousedown', forceChange)
	}

	private onDragstart(e: {current: vec2}) {
		const position = ratio(this.value, 0, this.info.max[this.varying])

		this.slitMinY = e.current[1] + position * SLIT_HEIGHT
		this.slitMaxY = e.current[1] - (1 - position) * SLIT_HEIGHT
		this.slitLeft = getDOMCenter(this.$refs.input as HTMLElement)[0]
		this.previewY = e.current[1]
		this.isDragging = true
	}

	private onDrag(e: {current: vec2; delta: vec2}) {
		this.previewY = clamp(e.current[1], this.slitMaxY, this.slitMinY)
		const t = ratio(this.previewY, this.slitMinY, this.slitMaxY)
		const newValue = lerp(0, this.info.max[this.varying], t)
		this.$emit('update:element', newValue)
	}

	private onDragend() {
		this.isDragging = false
	}

	@Watch('color')
	private onColorChanged(newColor: DataColor, oldColor: DataColor) {
		if (oldColor[1][this.varying] !== newColor[1][this.varying]) {
			this.updatedRecently = true
			clearTimeout(this.updatedTimer)

			// @ts-ignore
			this.updatedTimer = setTimeout(() => {
				this.updatedRecently = false
			}, 100)
		}
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

.InputColorElement
	input-border-style()
	position relative
	background var(--color-field)

	&:hover
		z-index 1
		input-border-hover-style()

	&[editing], &[selected], &[updating]
		z-index 2
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

		^[0][editing] > &
			visibility hidden

	&__label
		position absolute
		margin-left -0.05em
		height 100%
		color var(--color-border-text)
		font-size 0.9em
		line-height 'calc(var(--layout-input-height) * %s)' % (1 / @font-size)

	&__unit
		margin-right -0.1em
		margin-left -0.1em
		color var(--color-border-text)
		font-size 1em

	&__input
		opacity 0

		^[0][editing] > &
			opacity 1

	&__slit
		position absolute
		width 3px
		height 100px
		border-radius 1.5px

	&__preview
		position absolute
		margin-top -0.5 * $color-preview-size
		margin-left -0.5 * $color-preview-size
		width $color-preview-size
		height $color-preview-size
		border-radius 50%
</style>

