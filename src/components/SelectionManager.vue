<template>
	<div class="SelectionManager">
		<slot/>
		<Popover class="SelectionManager__popover" :active="showControl" ref="popover">
			<Drag
				@dragstart="onDragstart"
				@drag="onDrag"
				@dragend="onDragend"
				detectDirection="horizontal"
				:dragging="dragOperator !== null"
			>
				<ul class="SelectionManager__menu" :selectable="true">
					<li v-if="controls.add" class="SelectionManager__control">
						<InputIconButton src="./assets/icon_plus.svg" mode="add"/>
					</li>
					<li v-if="controls.multiply" class="SelectionManager__control">
						<InputIconButton src="./assets/icon_cross.svg" mode="multiply"/>
					</li>
					<li v-if="controls.hueRotate" class="SelectionManager__control">
						<InputIconButton src="./assets/icon_h.svg" mode="hue-rotate"/>
					</li>
					<li v-if="controls.saturate" class="SelectionManager__control">
						<InputIconButton src="./assets/icon_s.svg" mode="saturate"/>
					</li>
					<li v-if="controls.brightness" class="SelectionManager__control">
						<InputIconButton src="./assets/icon_b.svg" mode="brightness"/>
					</li>
					<li v-if="controls.swap" class="SelectionManager__control">
						<InputIconButton src="./assets/icon_swap.svg" @click="swapValues"/>
					</li>
				</ul>
			</Drag>
		</Popover>
		<Portal v-if="dragOperator !== null">
			<svg class="svg-overlay">
				<text :x="dragPosition[0]" :y="dragPosition[1]" class="text">{{dragText}}</text>
			</svg>
		</Portal>
	</div>
</template>


<script lang="ts">
import {Component, Prop, Vue, Provide} from 'vue-property-decorator'

import keypressed from '../util/keypressed'
import {vec2} from 'gl-matrix'

import Drag from './common/Drag'
import Popover from './common/Popover.vue'
import Portal from './common/Portal'
import InputIconButton from './InputIconButton.vue'
import {MouseDragEvent, adjustHSB} from '../util'
import {allSettled} from 'q'
import {DataColor} from '../data'
import {clamp} from '../math'

interface SelectableNode<T> {
	isSelected: boolean
	updateValue: (newValue: T) => void
	value?: T
	_props: {
		value: T
	}
}
type SelectionContext = 'scalar' | 'color'

interface Selection {
	node: SelectableNode<number | DataColor>
	context: SelectionContext
}

type DragOperatorFunc = (
	value: number | DataColor,
	e: MouseDragEvent
) => {value: number | DataColor; text: string}

@Component({components: {Drag, Popover, Portal, InputIconButton}})
export default class SelectionManager extends Vue {
	@Provide() public SelectionManager = this

	private items: Selection[] = []

	private dragStartValues: Array<number | DataColor> = []
	private dragText: string = ''
	private dragPosition: vec2 = vec2.create()
	private dragOperator: DragOperatorFunc | null = null

	private controls: {[key: string]: boolean} = {
		add: false,
		multiply: false,
		hueRotate: false,
		saturate: false,
		brightness: false,
		swap: false
	}

	public add(node: any, context: SelectionContext = 'scalar') {
		if (!keypressed('cmd') || keypressed('tab')) {
			this.deselectAll()
		}

		// Add/remove to selection list
		const existingIndex = this.items.findIndex(
			selection => node === selection.node
		)
		if (existingIndex === -1) {
			node.isSelected = true
			this.items.push({node, context})
		} else {
			node.isSelected = false
			this.items.splice(existingIndex, 1)
		}

		if (this.items.length > 1) {
			// Re-assigning the reference element for popper.js
			const popover = this.$refs.popover as Popover
			popover.setReference(node.$el)

			// Determine if each control should be enabled
			let commonContext: SelectionContext | null = this.items[0].context
			for (let i = 1; i < this.items.length; i++) {
				if (this.items[i].context !== commonContext) {
					commonContext = null
					break
				}
			}

			// Scalar operators
			const isAllScalar = commonContext === 'scalar'
			this.controls.add = isAllScalar
			this.controls.multiply = isAllScalar

			// Color operators
			const isAllColor = commonContext === 'color'
			this.controls.hueRotate = isAllColor
			this.controls.saturate = isAllColor
			this.controls.brightness = isAllColor

			// Swap
			const isNumSelectionEven = this.items.length % 2 === 0
			this.controls.swap = isNumSelectionEven && commonContext !== null
		} else {
			for (const key in this.controls) {
				this.controls[key] = false
			}
		}
	}

	private mounted() {
		window.addEventListener('mousedown', this.deselectOnClickOutside)
	}

	private beforeDestroy() {
		this.deselectAll()
		window.removeEventListener('mousedown', this.deselectOnClickOutside)
	}

	private get showControl(): boolean {
		const isEitherFlagOn = Object.values(this.controls).some(flag => flag)
		return this.items.length > 0 && isEitherFlagOn
	}

	private deselectAll() {
		for (const item of this.items) {
			item.node.isSelected = false
		}
		this.items.splice(0, this.items.length)
	}

	private onDragstart(e: MouseDragEvent) {
		const path = e.originalEvent.composedPath() as HTMLElement[]

		let mode: string | null = null
		for (const el of path) {
			if (!el.getAttribute) {
				break
			}
			mode = mode = el.getAttribute('mode')
			if (!!mode) {
				break
			}
		}

		console.log(mode)

		if (mode !== null) {
			if (mode === 'add') {
				this.dragOperator = (startValue, _e) => {
					const inc = _e.offset[0]
					const value = (startValue as number) + inc
					const text = (inc > 0 ? '+' : '') + inc.toFixed(0)
					return {value, text}
				}
			} else if (mode === 'multiply') {
				this.dragOperator = (startValue, _e) => {
					const inc = 1 + _e.offset[0] / 200
					const value = (startValue as number) * inc
					const text = '×' + (inc * 100).toFixed(0) + '%'
					return {value, text}
				}
			} else if (mode === 'hue-rotate') {
				this.dragOperator = (startColor, _e) => {
					const inc = _e.offset[0]
					const value = adjustHSB(startColor as DataColor, inc, 0, 0)
					const text = (inc > 0 ? '+' : '') + inc.toFixed(0) + '°'
					return {value, text}
				}
			} else if (mode === 'saturate' || mode === 'brightness') {
				console.log(mode)
				this.dragOperator = (startColor, _e) => {
					const inc = clamp(_e.offset[0] / 2, -100, 100)

					const sat = mode === 'saturate' ? inc : 0
					const bri = mode === 'brightness' ? inc : 0

					const value = adjustHSB(startColor as DataColor, 0, sat, bri)
					const text = (inc > 0 ? '+' : '') + inc.toFixed(0) + '%'
					return {value, text}
				}
			}

			this.dragStartValues = this.items.map(
				({node}) => node.value || node._props.value
			)
		} else {
			this.dragOperator = null
			e.abort()
		}
	}

	private async onDrag(e: MouseDragEvent) {
		for (const [i, item] of this.items.entries()) {
			const {value, text} = this.dragOperator!(this.dragStartValues[i], e)
			this.dragText = text
			item.node.updateValue(value)
			await this.$nextTick()
		}

		this.$set(this.dragPosition, 0, e.current[0])
		this.$set(this.dragPosition, 1, e.current[1])
	}

	private onDragend() {
		this.dragOperator = null
	}

	private async swapValues() {
		for (let i = 0; i < this.items.length; i += 2) {
			const nodeA = this.items[i].node
			const nodeB = this.items[i + 1].node

			const valueA = nodeA.value || nodeA._props.value
			const valueB = nodeB.value || nodeB._props.value

			nodeA.updateValue(valueB)
			await this.$nextTick()
			nodeB.updateValue(valueA)
		}
	}

	private deselectOnClickOutside(e: Event) {
		if (this.items.length === 0) {
			return
		}

		let target = e.target
		let clickedSelectable = false

		while (target !== null && target instanceof HTMLElement) {
			if (target.getAttribute('selectable') !== null) {
				clickedSelectable = true
			}
			target = target.parentElement
		}

		if (!clickedSelectable) {
			this.deselectAll()
		}
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.SelectionManager
	width 100%
	height 100%

	&__popover
		enable-menu-color()

	&__menu
		display flex
		box-sizing content-box
		margin 0.2em
		height var(--input-height)
		border solid 1px var(--color-bg)
		border-radius $border-radius
		background var(--color-bg)
		line-height var(--input-height)
		opacity 0.3
		transition all 0.1s ease
		// transform scale(0.5)
		transform-origin 50% 0
		user-select none

		&:hover, &[dragging]
			opacity 1
			// transform none
</style>
