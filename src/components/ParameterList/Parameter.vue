<template>
	<div
		class="Parameter"
		:class="{popovering: isBindOpen || isContextMenuOpen}"
		@click.right="openContextMenu"
	>
		<label class="Parameter__label">{{schema.label}}</label>
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
			<PaneBind :value="value" :schema="schema" @update:schema="$emit('update:schema', schema)"/>
		</Popover>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import Mousetrap from 'mousetrap'

import Portal from '../common/Portal'
import Menu from '../common/Menu'
import Popover from '../common/Popover.vue'
import PaneBind from '../PaneBind'

import BindManager from '../../manager/BindManager'
import deepcopy from '../../util/deepcopy'
import {Color} from '../../data'
import {Schema} from '../../data/Schema'

@Component({
	components: {Portal, Menu, Popover, PaneBind}
})
export default class Parameter extends Vue {
	@Prop(Object) private schema!: Schema
	@Prop() private value!: any
	@Prop() private default!: any
	private isContextMenuOpen: boolean = false
	private isBindOpen: boolean = false

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
			this.$emit('input', this.default)
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '../../style/config.styl'

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
		width var(--parameter-list-width)
		white-space nowrap
		line-height var(--layout-input-height)

	&__field
		display flex
		flex-grow 1

		& > .grow
			flex-grow 1
</style>


