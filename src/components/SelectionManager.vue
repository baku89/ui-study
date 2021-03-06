<template>
	<div class="SelectionManager">
		<slot/>
		<Popover class="SelectionManager__popover" :active="showControl" ref="popover">
			<Drag @dragstart="onDragstart" @drag="onDrag" @dragend="onDragend">
				<ul class="SelectionManager__menu" :class="{dragging}" :selectable="true">
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
		<Portal v-if="dragging">
			<svg class="svg-overlay">
				<SvgOverlayHorizontalDrag
					:position="drag.position"
					:to-right="drag.inc > 0"
					:speed="drag.speed"
					:text="drag.text"
				></SvgOverlayHorizontalDrag>
			</svg>
		</Portal>
	</div>
</template>


<script lang="ts">
import {Component, Prop, Vue, Provide, Inject} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'

import Drag from './common/Drag'
import Popover from './common/Popover.vue'
import Portal from './common/Portal'
import SvgOverlayHorizontalDrag from './common/SvgOverlayHorizontalDrag.vue'
import InputIconButton from './InputIconButton'

import {MouseDragEvent} from '../util'
import Color from '../data/Color'
import {clamp, toFixed} from '../math'
import {ConfigDefault} from '../core/config'
import BindManager from '../manager/BindManager'
import HistoryManager from '../manager/HistoryManager'

interface SelectableNode<T> {
	selected: boolean
	updateValue: (newValue: T) => void
	value?: T
	_props: {
		value: T
	}
}

type SelectionContext = 'scalar' | 'color'

interface Selection {
	node: SelectableNode<number | Color>
	context: SelectionContext
}

type DragOperatorFunc = (value: number | Color, inc: number) => number | Color

function getValue(node: SelectableNode<any>) {
	return node.value !== undefined ? node.value : node._props.value
}

@Component({
	components: {Drag, Popover, Portal, SvgOverlayHorizontalDrag, InputIconButton}
})
export default class SelectionManager extends Vue {
	@Provide() public SelectionManager = this

	@Inject({from: 'Config', default: ConfigDefault})
	private readonly Config!: any

	private items: Selection[] = []

	private dragging: boolean = false
	private drag: {
		startValues: any[]
		lastValues: any[]
		inc: number
		speed: 'normal' | 'fast' | 'slow'
		text: string
		position: vec2
		operator?: DragOperatorFunc
		stringify?: (inc: number) => string
	} = {
		startValues: [],
		lastValues: [],
		inc: 0,
		speed: 'normal',
		text: '',
		position: vec2.create()
	}

	private controls: {[key: string]: boolean} = {
		add: false,
		multiply: false,
		hueRotate: false,
		saturate: false,
		brightness: false,
		swap: false
	}

	public add(node: any, context: SelectionContext = 'scalar') {
		if (!BindManager.pressed('/key/cmd') || BindManager.pressed('/key/tab')) {
			this.deselectAll()
		}

		// Add/remove to selection list
		const existingIndex = this.items.findIndex(
			selection => node === selection.node
		)
		if (existingIndex === -1) {
			node.selected = true
			this.items.push({node, context})
		} else {
			node.selected = false
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
			for (const key of Object.keys(this.controls)) {
				this.controls[key] = false
			}
		}
	}

	private created() {
		this.items = []
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
			item.node.selected = false
		}
		this.items.splice(0, this.items.length)
	}

	private onDragstart(e: MouseDragEvent) {
		const path = e.originalEvent.composedPath() as HTMLElement[]
		const {drag} = this

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

		this.dragging = mode !== null

		if (this.dragging) {
			if (mode === 'add') {
				drag.operator = (startValue, inc) => {
					return (startValue as number) + inc
				}
				drag.stringify = inc => {
					return (inc > 0 ? '+' : '') + inc.toFixed(1)
				}
			} else if (mode === 'multiply') {
				drag.operator = (startValue, inc) => {
					return (startValue as number) * (1 + inc / 100)
				}
				drag.stringify = inc => {
					return '×' + (100 + inc).toFixed(0) + '%'
				}
			} else if (mode === 'hue-rotate') {
				drag.operator = (startColor, inc) => {
					return Color.adjustHSB(startColor as Color, inc, 0, 0)
				}
				drag.stringify = inc => {
					return (inc > 0 ? '+' : '') + inc.toFixed(0) + '°'
				}
			} else if (mode === 'saturate' || mode === 'brightness') {
				drag.operator = (startColor, inc) => {
					inc = clamp(inc / 2, -100, 100)

					const sat = mode === 'saturate' ? inc : 0
					const bri = mode === 'brightness' ? inc : 0

					return Color.adjustHSB(startColor as Color, 0, sat, bri)
				}
				drag.stringify = inc => {
					return (inc > 0 ? '+' : '') + inc.toFixed(0) + '%'
				}
			}

			drag.startValues = this.items.map(({node}) => getValue(node))
			drag.lastValues = [...drag.startValues]
			drag.inc = 0

			this.$set(drag.position, 0, e.current[0])
			this.$set(drag.position, 1, e.current[1])
		} else {
			e.abort()
		}
	}

	private async onDrag(e: MouseDragEvent) {
		const {drag} = this

		drag.speed = BindManager.pressed(this.Config.keyFaster)
			? 'fast'
			: !BindManager.pressed(this.Config.keySlower)
			? 'normal'
			: 'slow'

		const multiplier =
			drag.speed === 'fast' ? 10 : drag.speed === 'normal' ? 1 : 0.1

		drag.inc += e.delta[0] * this.Config.dragSpeed * multiplier
		drag.text = drag.stringify!(drag.inc)
		this.$set(drag.position, 0, e.current[0])
		this.$set(drag.position, 1, e.current[1])

		for (const [i, item] of this.items.entries()) {
			const newValue = drag.operator!(drag.startValues[i], drag.inc)
			drag.lastValues[i] = newValue
			item.node.updateValue(newValue)
			await this.$nextTick()
		}

		return false
	}

	private onDragend() {
		this.dragging = false

		const items = [...this.items]
		const startValues = [...this.drag.startValues]
		const endValues = [...this.drag.lastValues]

		const undo = async () => {
			for (const [i, item] of items.entries()) {
				item.node.updateValue(startValues[i])
				await this.$nextTick()
			}
		}

		const redo = async () => {
			for (const [i, item] of items.entries()) {
				item.node.updateValue(endValues[i])
				await this.$nextTick()
			}
		}

		HistoryManager.addHistory({undo, redo})
	}

	private async swapValues() {
		for (let i = 0; i < this.items.length; i += 2) {
			const nodeA = this.items[i].node
			const nodeB = this.items[i + 1].node

			const valueA = getValue(nodeA)
			const valueB = getValue(nodeB)

			nodeA.updateValue(valueB)
			await this.$nextTick()
			nodeB.updateValue(valueA)
			await this.$nextTick()
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

		console.log(clickedSelectable)

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

	&__menu
		enable-menu-color()
		display flex
		box-sizing content-box
		margin 0.2em
		height var(--layout-input-height)
		border solid 1px var(--color-bg)
		border-radius $border-radius
		background var(--color-bg)
		font-size 0.8em
		line-height var(--layout-input-height)
		opacity 0.3
		// transition all 0.1s ease
		// transform scale(0.8)
		transform-origin 50% 0
		user-select none

		&:hover, &.dragging
			opacity 1
			transform none
</style>
