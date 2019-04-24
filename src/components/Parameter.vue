<template>
	<div class="Parameter" @click.right="openContextMenu">
		<label class="Parameter__label" v-if="label" :style="{width}">{{label}}</label>
		<div class="Parameter__field">
			<slot/>
		</div>
		<Popover class="Parameter__context-menu" :active.sync="isContextMenuOpen">
			<Menu :items="contextMenuItems" @click="onClickContextMenu"/>
		</Popover>
		<Popover :active.sync="isBindOpen" position="mouse">
			<div class="Parameter__bind">
				<InputString :value="shortcut" @change="setShortcut"/>
			</div>
		</Popover>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import Mousetrap from 'mousetrap'

import Popover from './common/Popover.vue'
import Portal from './common/Portal'
import Menu from './common/Menu'

import InputString from './InputString.vue'

@Component({
	components: {Popover, Portal, Menu, InputString}
})
export default class Parameter extends Vue {
	@Prop(String) private label!: string
	@Prop(String) private width!: string
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
				label: 'Reset'
			})
		}

		return items
	}

	private shortcut: string = ''

	private openContextMenu(e: Event) {
		if (this.contextMenuItems.length > 0) {
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

	private setShortcut(shortcut: string) {
		this.shortcut = shortcut

		Mousetrap.bind(shortcut, () => {
			this.$emit('input', this.value + 1)
		})
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

	&:hover
		background var(--color-border)
		--color-bg var(--color-border)

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

	&__bind
		position fixed
		top 50%
		left 50%
		border-radius $border-radius
		background var(--color-menu-bg)
		enable-menu-color()
		padding var(--layout-popover-padding)
		background var(--color-bg)
</style>


