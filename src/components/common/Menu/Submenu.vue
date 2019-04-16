<template>
	<ul :class="{Submenu: true, compact: type === 'compact'}">
		<li
			v-for="(item, index) in items"
			:key="item.value"
			:class="liClasses(index)"
			@mouseenter="onHoverItem(index)"
			@click="$emit('click', item.value)"
		>
			<div
				class="Submenu__text"
				v-html="type === 'compact' ? (item.shortLabel || item.label) : item.label"
			/>
			<Icon
				v-if="!!item.submenu"
				tag="button"
				class="Submenu__arrow"
				src="./assets/icon_right-arrow.svg"
				:size="0.5"
			/>
			<Popover
				class="Submenu__submenu"
				:active="!!item.submenu && index === selectedIndex"
				placement="right-start"
			>
				<Submenu
					ref="submenu"
					:items="item.submenu"
					:type="item.type"
					@click="$emit('click', $event)"
					@select="isSubSelected = true"
					@unselect="isSubSelected = false"
				/>
			</Popover>
		</li>
	</ul>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import keycode from 'keycode'

import {clamp, cycleMod} from '../../../math'

import Popover from '../../../components/common/Popover.vue'
import Icon from '../../../components/common/Icon.vue'
import MenuItem from './MenuItem'

@Component({
	components: {Popover, Icon}
})
export default class Submenu extends Vue {
	@Prop({type: Array, required: true}) private items!: MenuItem[]
	@Prop({type: String, default: 'normal'}) private type!:
		| 'normal'
		| 'submenu'
		| 'compact'
	@Prop({type: Boolean, default: true}) private hasParent!: boolean

	private selectedIndex: number | null = null
	private isSubSelected: boolean = false

	public setSelectedIndex(index: number | null) {
		this.selectedIndex = index
	}

	@Watch('items')
	private onItemsChanged() {
		// console.log('changed item', this.items.length)

		if (this.items.length === 0) {
			this.selectedIndex = null
		} else {
			if (this.selectedIndex === null) {
				this.selectedIndex = 1
			} else {
				// clamp selectedIndex within Array this.items
				this.selectedIndex = clamp(this.selectedIndex, 0, this.items.length - 1)
			}
		}
	}

	private liClasses(index: number): string[] {
		const classes = ['Submenu__li']

		if (index === this.selectedIndex) {
			classes.push(this.isSubSelected ? 'sub-selected' : 'selected')
		}

		return classes
	}

	private onHoverItem(index: number) {
		if (this.isSubSelected) {
			this.isSubSelected = false
			console.log(this.$refs.submenu)
			const submenus = this.$refs.submenu as Submenu[]
			if (submenus.length > 0) {
				submenus[0].setSelectedIndex(null)
			}
		}
		this.selectedIndex = index
		this.$emit('select')
	}

	// Lifecycle hooks
	private mounted() {
		window.addEventListener('keydown', this.onKeydown)
	}

	private beforeDestroy() {
		window.removeEventListener('keydown', this.onKeydown)
	}

	private onKeydown(e: KeyboardEvent) {
		if (this.isSubSelected) {
			return
		}

		const key = keycode(e)

		if (key === 'enter') {
			if (this.selectedIndex !== null) {
				this.$emit('click', this.items[this.selectedIndex].value)
			}
		} else if (key === 'up' || key === 'down') {
			// Navigate by vertical arrow keys
			this.selectNeighbour(key === 'up' ? -1 : 1)
		} else if (key === 'right') {
			if (this.selectedIndex === null) {
				this.selectedIndex = 0
			} else {
				if (this.type === 'compact') {
					this.selectNeighbour(1)
				} else {
					if (this.items[this.selectedIndex].submenu) {
						this.isSubSelected = true
					}
				}
			}
		} else if (key === 'left') {
			if (this.type === 'compact') {
				// Move to parent if the first item is selected,
				// otherwise simply move left
				if (this.selectedIndex === 0) {
					if (this.hasParent) {
						this.selectedIndex = null
						this.$emit('unselect')
					}
				} else {
					this.selectNeighbour(-1)
				}
			} else {
				// Move to parent
				if (this.hasParent) {
					this.selectedIndex = null
					this.$emit('unselect')
				}
			}
		}
	}

	private selectNeighbour(inc: number) {
		if (this.selectedIndex === null) {
			// When nothing is selected, highlight an item on a edge
			this.selectedIndex = inc > 0 ? 0 : this.items.length - 1
		} else {
			// Otherwise, simply move up/down
			this.selectedIndex = cycleMod(this.selectedIndex, inc, this.items.length)
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '../../../style/config.styl'

.Submenu
	&.compact
		display flex

	&__li
		display flex
		padding 0 1em
		padding-left 1em
		line-height var(--input-height)

		u
			text-decoration underline

		&.selected
			background var(--color-active)

	&__text
		flex-grow 1

	&__arrow
		margin-right -1.2em
		width var(--input-height)

		^[0]__li.sub-selected &
			color var(--color-active)

	&__submenu
		overflow hidden
		border-radius $border-radius
		background black
		color white
		user-select none
</style>
