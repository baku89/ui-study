<template>
	<div class="Menu">
		<input
			class="Menu__filter"
			type="text"
			v-if="isFiltering"
			:value="filterText"
			@keydown="onKeydownFilterText"
			@input="onInputFilterText"
			ref="filter"
		>
		<Submenu
			ref="menu"
			class="Menu__list"
			:items="isFiltering ? filteredItems : items"
			:has-parent="false"
			@click="$emit('click', $event)"
		/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import keycode from 'keycode'
import fuzzy from 'fuzzy'

import Submenu from './Submenu.vue'
import MenuItem from './MenuItem'

@Component({
	components: {Submenu}
})
export default class Menu extends Vue {
	@Prop({type: Array, required: true}) private items!: MenuItem[]
	private filterText: string | null = null

	// Computed properties
	private get isFiltering(): boolean {
		return this.filterText !== null
	}

	private get numValues(): number {
		return !this.isFiltering ? this.items.length : this.filteredItems!.length
	}

	private get flattenedItems(): MenuItem[] {
		const flattenedItems: MenuItem[] = []

		const searchItems = (items: MenuItem[]) => {
			items.forEach(item => {
				flattenedItems.push({...item, type: undefined, submenu: undefined})

				if (item.submenu) {
					searchItems(item.submenu)
				}
			})
		}
		searchItems(this.items)

		return flattenedItems
	}

	private get filteredItems(): MenuItem[] | null {
		if (this.isFiltering) {
			const filteredItems = fuzzy.filter(
				this.filterText as string,
				this.flattenedItems,
				{
					extract: el => el.label,
					pre: '<u>',
					post: '</u>'
				}
			)

			return filteredItems.map(el => {
				return {value: el.original.value, label: el.string}
			})
		} else {
			return null
		}
	}

	// Lifecycle hooks
	private mounted() {
		window.addEventListener('keydown', this.onKeydown)
	}

	private beforeDestroy() {
		window.removeEventListener('keydown', this.onKeydown)
	}

	// Events

	private onKeydown(e: KeyboardEvent) {
		const key = keycode(e)

		// Show filtering input,
		// if the pressed key is neither modifier keys nor arrow keys
		if (key.length === 1) {
			// Show filtering input
			if (!this.isFiltering) {
				this.filterText = ''
				;(this.$refs.menu as Submenu).setSelectedIndex(0)
				this.$nextTick(() => {
					;(this.$refs.filter as HTMLInputElement).focus()
				})
			}
		}
	}

	private onInputFilterText(e: Event) {
		const value = (this.$refs.filter as HTMLInputElement).value

		if (value === '') {
			this.filterText = null
		} else {
			this.filterText = value
		}
	}

	private onKeydownFilterText(e: KeyboardEvent) {
		const key = keycode(e)

		if (key === 'up' || key === 'down') {
			e.preventDefault()
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '../../../style/config.styl'

.Menu
	overflow hidden
	border-radius $border-radius
	background black
	color white
	user-select none

	&__filter
		display block
		margin 0.5em
		padding 0 0.3em
		border 1px solid #333
		border-radius $border-radius
		font-family var(--font-normal)
		line-height $input-height
</style>
