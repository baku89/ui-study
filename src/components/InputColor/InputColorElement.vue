<template>
	<div
		class="InputColorElement"
		:class="{editing, selected, updating: dragging || updatedRecently}"
		:selectable="true"
	>
		<Drag
			:dragging.sync="dragging"
			:minDragDistance="3"
			detectDirection="vertical"
			@dragstart="onDragstart"
			@drag="onDrag"
			@click="onClick"
		>
			<div class="InputColorElement__display">
				<div class="InputColorElement__prefix" v-if="info.prefix[varying]">{{info.prefix[varying]}}</div>
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
			v-model="inputValue"
			@focus="onFocus"
			@change="onChange"
			@blur="editing = false"
			@keydown="onKeydown"
			ref="input"
		>
		<Portal v-if="dragging">
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

import {getDOMCenter} from '../../util'
import {parseNumber, ratio, clamp, lerp} from '../../math'
import BindManager from '../../manager/BindManager'
import Color, {ColorModeInfo} from '../../data/Color'

import Drag from '../common/Drag'
import Portal from '../common/Portal'
import SvgArrow from '../common/SvgArrow.vue'
import GradientPalette from '../common/GradientPalette'
import SelectionManager from '../SelectionManager.vue'
import {ConfigDefault} from '../../core/config'

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
	public selected: boolean = false

	@Prop({type: Object, required: true}) private color!: Color
	@Prop({type: Number, required: true}) private varying!: number

	private inputValue: string = ''

	private editing: boolean = false
	private dragging: boolean = false
	private slitMaxY: number = 0
	private slitMinY: number = 0
	private slitLeft: number = 0
	private previewY: number = 0

	private updatedRecently: boolean = false
	private updatedTimer!: number

	@Inject({from: 'SelectionManager', default: null})
	private readonly SelectionManager!: SelectionManager

	@Inject({from: 'Config', default: ConfigDefault})
	private readonly Config!: any

	private get value(): number {
		return (this.color.elements as number[])[this.varying]
	}

	private get slitStyles() {
		return {
			left: this.slitLeft - SLIT_WIDTH * 0.5 + 'px',
			top: this.slitMaxY - SLIT_WIDTH * 0.5 + 'px',
			height: this.slitMinY - this.slitMaxY + SLIT_WIDTH + 'px'
		}
	}

	private get previewStyles() {
		return {
			background: this.color.cssColor,
			left: `${this.slitLeft}px`,
			top: `${this.previewY}px`
		}
	}

	private get info(): any {
		return ColorModeInfo[this.color.mode]
	}

	private setInputValue() {
		this.inputValue = this.value.toString()
	}

	private created() {
		this.inputValue = this.value.toString()
	}

	private onFocus(e: Event) {
		this.editing = true
		if (this.SelectionManager) {
			this.SelectionManager.add(this)
		}
	}

	private onChange() {
		const newValue: number = parseNumber(this.inputValue)

		if (!isNaN(newValue)) {
			this.updateValue(newValue)
		} else {
			this.setInputValue()
		}
	}

	private updateValue(newValue: number) {
		newValue = clamp(newValue, 0, this.info.max[this.varying])
		if (this.value !== newValue) {
			this.$emit('update:element', newValue)
		}
	}

	private onKeydown(e: KeyboardEvent) {
		const key = BindManager.keycode(e)

		if (key === 'up' || key === 'down') {
			let inc = key === 'up' ? 1 : -1

			if (BindManager.pressed(this.Config.keyFaster)) {
				inc *= 10
			}
			this.updateValue(this.value + inc)
		}
	}

	private onClick() {
		const input = this.$refs.input as HTMLInputElement
		input.focus()
		input.select()
		this.editing = true

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
	}

	private onDrag(e: {current: vec2; delta: vec2}) {
		this.previewY = clamp(e.current[1], this.slitMaxY, this.slitMinY)
		const t = ratio(this.previewY, this.slitMinY, this.slitMaxY)

		const newValue = lerp(0, this.info.max[this.varying], t)

		if (this.color.elements[this.varying] !== newValue) {
			this.$emit('update:element', newValue)
		}
	}

	@Watch('color')
	private onColorChanged(newColor: Color, oldColor: Color) {
		const oldElements = oldColor.elements as number[]
		const newElements = newColor.elements as number[]
		if (oldElements[this.varying] !== newElements[this.varying]) {
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
	input-placement-modifier-root()
	input-placement-modifier-border()
	position relative
	background var(--color-field)

	&:hover
		input-border-hover-style()

	&.editing, &.selected, &.updating
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

		^[0].editing > &
			visibility hidden

	&__prefix
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

		^[0].editing > &
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

