<template>
	<div
		class="Parameter"
		:class="{popovering: isBindOpen || isContextMenuOpen}"
		@click.right="openContextMenu"
	>
		<label class="Parameter__label" v-if="label" :style="{width}">{{label}}</label>
		<div class="Parameter__field">
			<slot/>
		</div>
		<Popover
			class="Parameter__context-menu"
			:active.sync="isContextMenuOpen"
			position="cursor"
			placement="right-start"
		>
			<Menu :items="contextMenuItems" @click="onClickContextMenu"/>
		</Popover>
		<Popover :active.sync="isBindOpen">
			<PaneBind
				:value="value"
				:precision="precision"
				:max="max"
				:min="min"
				:step="step"
				:unit="unit"
				:ui="bindUI"
				:bindList="bindList"
				@update:bindList="onBindListUpdated"
			/>
		</Popover>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import Mousetrap from 'mousetrap'

import Portal from './common/Portal'
import Menu from './common/Menu'
import Popover from './common/Popover.vue'
import PaneBind from './PaneBind'

import BindManager from '../core/BindManager'
import deepcopy from '../util/deepcopy'

@Component({
	components: {Portal, Menu, Popover, PaneBind}
})
export default class Parameter extends Vue {
	@Prop(String) private label!: string
	@Prop(String) private width!: string
	@Prop() private value!: any
	@Prop(Number) private precision!: number
	@Prop([Number, Array]) private min!: number | number[]
	@Prop([Number, Array]) private max!: number | number[]
	@Prop(Number) private step!: number
	@Prop(String) private unit!: number
	@Prop() private default!: any
	@Prop({
		type: Array,
		default() {
			return []
		}
	})
	private bindList!: any

	private isContextMenuOpen: boolean = false
	private isBindOpen: boolean = false

	private get bindUI(): 'number' | 'color' | 'string' | 'vector' | 'checkbox' {
		const valueType = typeof this.value

		if (valueType === 'number' || valueType === 'string') {
			return valueType
		} else if (valueType === 'boolean') {
			return 'checkbox'
		} else {
			if (Array.isArray(this.value)) {
				if (this.value.every(val => typeof val === 'number')) {
					return 'vector'
				} else {
					return 'color'
				}
			}
		}

		return 'number'
	}

	private get contextMenuItems(): any[] {
		const items = []
		if (this.value !== undefined) {
			items.push({
				value: 'bind',
				label: 'Bind'
			})
		}
		if (this.default !== undefined) {
			items.push({
				value: 'reset',
				label: 'Reset to Default'
			})
		}

		return items
	}

	private openContextMenu(e: MouseEvent) {
		if (this.contextMenuItems.length > 0 && !e.altKey) {
			e.preventDefault()
			this.isContextMenuOpen = true
		}
	}

	private onClickContextMenu(value: string) {
		this.isContextMenuOpen = false

		if (value === 'bind') {
			this.isBindOpen = true
		} else if (value === 'reset') {
			console.log(this.default)
			this.$emit('input', this.default)
		}
	}

	private onBindListUpdated(bindList: any) {
		this.$emit('update:bindList', this.bindList)
	}
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.Parameter
	display flex
	padding 0.5em
	padding-top calc(0.5 * (var(--layout-param-height) - var(--layout-input-height)))
	padding-bottom calc(0.5 * (var(--layout-param-height) - var(--layout-input-height)))

	&:hover, &.popovering
		background var(--color-parameter-hover)
		--color-bg var(--color-parameter-hover)

	&__label
		overflow hidden
		margin-right 0.5em
		width 7em
		white-space nowrap
		line-height var(--layout-input-height)

	&__field
		display flex
		flex-grow 1

		& > .grow
			flex-grow 1
</style>


