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
		<ul class="Menu__list">
			<li
				v-for="(item, index) in isFiltering ? filteredItems : items"
				:key="item.value"
				class="Menu__li"
				:selected="index === selectedIndex"
				@mouseenter="selectedIndex = index"
				@click="$emit('select', item.value)"
				v-html="item.label"
			/>
		</ul>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import keycode from 'keycode'
import fuzzy, {filter} from 'fuzzy'

import {cycleMod, clamp} from '@/math'

import InputString from '../../InputString.vue'

interface MenuItem {
	value: string | number | symbol
	label: string
}

@Component({
	components: {InputString}
})
export default class Menu extends Vue {
	@Prop(Array) private items!: MenuItem[]

	private selectedIndex: number | null = null

	private filterText: string | null = null

	private get isFiltering(): boolean {
		return this.filterText !== null
	}

	private get numValues(): number {
		return !this.isFiltering ? this.items.length : this.filteredItems!.length
	}

	private mounted() {
		window.addEventListener('keydown', this.onKeydown)
	}

	private onKeydown(e: KeyboardEvent) {
		const key = keycode(e)

		if (key === 'enter') {
			if (this.selectedIndex !== null) {
				this.$emit('select', this.items[this.selectedIndex].value)
			}
		} else if (key === 'up' || key === 'down') {
			if (this.selectedIndex === null) {
				this.selectedIndex = key === 'down' ? 0 : this.numValues - 1
			} else {
				const inc = key === 'up' ? -1 : 1
				this.selectedIndex = cycleMod(this.selectedIndex, inc, this.numValues)
			}
		} else if (/[a-zA-Z0-9]/.test(key)) {
			if (!this.isFiltering) {
				this.filterText = ''
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

	private get filteredItems(): MenuItem[] | null {
		if (this.isFiltering) {
			const filteredItems = fuzzy.filter(
				this.filterText as string,
				this.items,
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

	@Watch('filterText')
	private onFilteredItemsChanged() {
		if (this.isFiltering) {
			if (this.selectedIndex === null) {
				if (this.numValues > 0) {
					this.selectedIndex = 0
				}
			} else {
				this.selectedIndex = clamp(this.selectedIndex, 0, this.numValues - 1)
			}
		}
	}

	private beforeDestroy() {
		window.removeEventListener('keydown', this.onKeydown)
	}
}
</script>

<style lang="stylus" scoped>
@import '../../../style/config.styl'

.Menu
	overflow hidden
	border-radius $border-radius
	background black
	box-shadow 0 0 1em 0 rgba(black, 0.1)
	color white

	&__filter
		display block
		padding 0 1em
		border-bottom 1px solid #222
		font-family var(--font-normal)
		line-height $input-height

	&__li
		padding 0 1em
		line-height $input-height
		cursor pointer

		u
			text-decoration underline

		&[selected]
			background var(--color-active)
</style>
