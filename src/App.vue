<template>
	<ConfigProvider v-slot="{lang}" ref="provider">
		<div class="App">
			<div class="App__title-bar">
				<button class="App__hamburger" @click="onClickMenu">
					<Icon
						class="mark menu"
						:src="isNavOpened ? './assets/icon_cross.svg' : './assets/icon_hamburger.svg'"
					></Icon>MENU
				</button>
				<div style="flex-grow:1;"/>
				<InputMode
					class="App__lang"
					:value="lang"
					:values="['en', 'ja']"
					:labels="['EN', 'JA']"
					@input="onChangeLang"
					style="--color-bg: white; --color-border: var(--color-text);"
				/>
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
	</ConfigProvider>
</template>

<script lang="ts">
import {Component, Vue, Watch, Inject} from 'vue-property-decorator'

import Icon from './components/common/Icon.vue'
import Modal from './components/common/Modal.vue'

import Components from './components'
const {ConfigProvider} = Components

import Home from './pages/Home'

@Component({
	components: {...Components, Home, Icon, Modal, ConfigProvider}
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

	private onChangeLang(newValue: string) {
		// @ts-ignore
		this.$refs.provider.set('lang', newValue)
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
		display flex
		align-items center
		box-sizing content-box
		width 100%
		height $title-bar-height
		border-bottom 1px solid var(--color-text)
		background white
		box-shadow 0 1px 0 0 white, 0 2px 0 0 var(--color-text)
		user-select none

	&__hamburger, &__settings
		height $title-bar-height
		line-height $title-bar-height
		cursor pointer

		&:hover
			background var(--color-active)
			color white

	&__hamburger
		width 10em
		border-right 1px dashed var(--color-text)
		letter-spacing 0.3em

	&__lang
		margin-right 1em

	&__settings
		right 0

	.mark
		display inline-block
		overflow hidden
		vertical-align middle
		letter-spacing 0
		line-height 1em

		&.menu
			margin-right 0.2em
			margin-bottom 0.22em
			width 1.4em
			height @width

		&.gear
			margin 0 0.4em 0.2em
			width 2em
			height @width

	&__view
		overflow scroll
		padding-top $title-bar-height
		height 100%
</style>
