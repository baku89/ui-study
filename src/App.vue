<template>
	<div class="App">
		<div class="App__title-bar">
			<button class="App__hamburger" @click="onClickMenu">
				<Icon
					class="mark menu"
					:src="isNavOpened ? './assets/icon_cross.svg' : './assets/icon_hamburger.svg'"
				></Icon>MENU
			</button>
			<button class="App__settings" @click="onClickSettings">
				<Icon class="mark gear" src="./assets/icon_gear.svg"/>
			</button>
		</div>
		<div class="App__nav" :open="isNavOpened">
			<div class="App__nav-content">
				<Home/>
			</div>
		</div>
		<div class="App__view">
			<router-view/>
		</div>
		<Modal :show="isSettingsOpened" @close="isSettingsOpened = false">
			<h2>Settings</h2>
		</Modal>
	</div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'

import Icon from './components/common/Icon.vue'
import Modal from './components/common/Modal.vue'

import Home from './pages/Home'

@Component({
	components: {Home, Icon, Modal}
})
export default class App extends Vue {
	private isSettingsOpened: boolean = false

	private get isNavOpened(): boolean {
		return this.$route.path === '/'
	}
	private onClickMenu() {
		if (this.isNavOpened) {
			this.$router.back()
		} else {
			this.$router.push('/')
		}
	}

	private onClickSettings() {
		this.isSettingsOpened = !this.isSettingsOpened
	}
}
</script>


<style lang="stylus">
@import './style/common.styl'

$title-bar-height = 3em

html, body
	height 100%

.App
	position relative
	width 100%
	height 100%

	&__nav
		$dur = 0.3s
		$easing = cubic-bezier(0.26, 0, 0.17, 1)
		position fixed
		top $title-bar-height
		z-index 1000
		visibility hidden
		width 100%
		height 'calc(100% - %s)' % $title-bar-height
		border-right 1px solid var(--color-border)
		background #fff
		opacity 0
		transition visibility 0s linear $dur, opacity $dur $easing, transform $dur $easing
		transform translateY(-2%)

		&[open]
			visibility visible
			opacity 1
			transition visibility 0s, opacity $dur $easing, transform $dur $easing
			transform none

		&:after
			position absolute
			top 100%
			display block
			width 100%
			height 20%
			background #ddd
			content ' '

	&__nav-content
		overflow scroll
		padding-top 3em
		height 100%

	&__title-bar
		position fixed
		top 0
		left 0
		z-index 1010
		width 100%
		height $title-bar-height
		background var(--color-menu-bg)
		user-select none

	&__hamburger, &__settings
		position absolute
		top 0
		height $title-bar-height
		color var(--color-menu-text)
		vertical-align middle
		letter-spacing 0.3em
		line-height $title-bar-height
		cursor pointer

		&:hover
			background var(--color-active)

	&__hamburger
		width 10em
		background #333

	&__settings
		right 0

	.mark
		display inline-block
		overflow hidden
		vertical-align middle
		letter-spacing 0
		line-height 1em

		&.menu
			margin-right 0.1em
			margin-bottom 0.22em
			width 1.4em
			height @width

		&.gear
			margin 0 0.4em 0.2em
			width 2em
			height @width

	&__view
		padding-top $title-bar-height
		height 100%
</style>
