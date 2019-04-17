<template>
	<div class="SelectionManager">
		<slot/>
		<Popover class="SelectionManager__popover" :active="showControl" ref="popover">
			<Drag
				@dragstart="onDragstart"
				@drag="onDrag"
				@dragend="onDragend"
				detectDirection="horizontal"
				coordinate="relative"
				:dragging="!!dragMode"
			>
				<div class="SelectionManager__control" :selectable="true">
					<InputIconButton src="./assets/icon_plus.svg" mode="add"/>
					<div class="SelectionManager__separator"/>
					<InputIconButton src="./assets/icon_cross.svg" mode="multiply"/>
				</div>
			</Drag>
		</Popover>
	</div>
</template>


<script lang="ts">
import {Component, Prop, Vue, Provide} from 'vue-property-decorator'

import keypressed from '../util/keypressed'
import {vec2} from 'gl-matrix'

import Drag from './common/Drag'
import Popover from './common/Popover.vue'
import InputIconButton from './InputIconButton.vue'

interface Selectable {
	isSelected: boolean
	updateValue: (newValue: number) => void
	_props: {
		value: number
	}
}

@Component({components: {Drag, Popover, InputIconButton}})
export default class SelectionManager extends Vue {
	@Provide() public SelectionManager = this

	private items: Selectable[] = []

	private dragStartValues: number[] = []
	private dragMode: 'add' | 'multiply' | null = null

	public add(item: any) {
		if (!keypressed('shift') || keypressed('tab')) {
			this.deselectAll()
		}

		const existingIndex = this.items.indexOf(item)
		if (existingIndex === -1) {
			item.isSelected = true
			this.items.push(item)
		} else {
			item.isSelected = false
			this.items.splice(existingIndex, 1)
		}

		if (this.items.length > 1) {
			const popover = this.$refs.popover as Popover
			popover.setReference(item.$el)
		}
	}

	private mounted() {
		window.addEventListener('mousedown', (e: Event) => {
			if (this.items.length === 0) {
				return
			}

			let target = e.target
			let clickedSelectable = false

			while (
				target !== null &&
				target instanceof HTMLElement &&
				target !== this.$el
			) {
				if (target.getAttribute('selectable') !== null) {
					clickedSelectable = true
				}
				target = target.parentElement
			}

			// const path = e.composedPath() as HTMLElement[]

			// const clickedSelectable = path.some(el => !!el.getAttribute('selectable'))

			console.log(clickedSelectable)

			if (!clickedSelectable) {
				this.deselectAll()
			}
		})
	}

	private get showControl(): boolean {
		return this.items.length >= 2
	}

	private deselectAll() {
		for (const item of this.items) {
			item.isSelected = false
		}
		this.items.splice(0, this.items.length)
	}

	private onDragstart(e: {
		originalEvent: MouseEvent
		preventDefault: () => void
	}) {
		const path = e.originalEvent.composedPath() as HTMLElement[]

		let mode
		for (const el of path) {
			mode = mode = el.getAttribute('mode')
			if (!!mode) {
				break
			}
		}

		if (mode === 'add' || mode === 'multiply') {
			this.dragMode = mode
			this.dragStartValues = this.items.map(item => item._props.value)
		} else {
			e.preventDefault()
		}
	}

	private async onDrag(e: {current: vec2}) {
		let inc

		if (this.dragMode === 'add') {
			inc = e.current[0]
		} else {
			inc = 1 + e.current[0] / 60
		}

		for (const [i, item] of this.items.entries()) {
			let newValue
			if (this.dragMode === 'add') {
				newValue = this.dragStartValues[i] + inc
			} else {
				newValue = this.dragStartValues[i] * inc
			}
			item.updateValue(newValue)
			await this.$nextTick()
		}
	}

	private onDragend() {
		this.dragMode = null
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

	&__control
		display flex
		box-sizing content-box
		margin 0.2em
		height var(--input-height)
		border solid 1px var(--color-bg)
		border-radius $border-radius
		background var(--color-bg)
		line-height var(--input-height)
		opacity 0.3
		user-select none

		&:hover, &[dragging]
			opacity 1

	&__separator
		margin 0 0.1em
		height 100%
		border-left 1px solid var(--color-border)
</style>
