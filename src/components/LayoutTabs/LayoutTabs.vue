<template>
	<div class="LayoutTabs">
		<div class="LayoutTabs__navigation">
			<button
				v-for="({label}, id) in Tabs.items"
				:key="id"
				class="LayoutTabs__nav-button"
				:class="{
					active: id === dActiveTab
				}"
				@click="setActiveTab(id)"
			>{{label}}</button>
		</div>
		<div class="LayoutTabs__content">
			<div class="LayoutTabs__container" :style="containerStyles">
				<slot/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Provide, Watch} from 'vue-property-decorator'

import LayoutTab from '../LayoutTab.vue'

@Component({
	provide() {
		return {
			// @ts-ignore
			Tabs: this.Tabs
		}
	}
})
export default class LayoutTabs extends Vue {
	@Prop([String, Number]) private activeTab!: string

	// Data
	private dActiveTab: string = ''
	private Tabs = {
		items: {}
	}

	// Computed
	private get activeTabIndex(): number {
		return Object.keys(this.Tabs.items).indexOf(this.dActiveTab)
	}

	private get containerStyles(): object {
		return {
			transform: `translate3D(${-this.activeTabIndex * 100}%, 0, 0)`
		}
	}

	private mounted() {
		if (this.activeTab === undefined) {
			this.dActiveTab = Object.keys(this.Tabs.items)[0]
		} else {
			this.dActiveTab = this.activeTab
		}
	}

	private setActiveTab(id: string) {
		this.dActiveTab = id
	}
}
</script>


<style lang="stylus" scoped>
.LayoutTabs
	position relative
	display flex
	flex-direction column

	&__navigation
		display flex
		height 3em

	&__nav-button
		position relative
		flex-grow 1
		background var(--color-border)
		color var(--color-border-text)

		&:before
			position absolute
			bottom 0
			display block
			width 100%
			border-bottom 2px solid transparent
			content ''

		&.active
			background var(--color-bg)
			color var(--color-text)

			&:before
				border-bottom-color var(--color-control)

		&:hover
			color var(--color-text)

			&:before
				border-bottom-color var(--color-active)

	&__content
		flex-grow 1
		overflow hidden
		width 100%
		height 100%

	&__container
		display flex
		flex-wrap nowrap
		width 100%
		height 100%
		transition transform 0.1s ease
		transform translateZ(0)
</style>

