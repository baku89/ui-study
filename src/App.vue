<template>
	<div class="App">
		<div class="App__title-bar" @click="onClickMenu">
			<button class="App__hamburger">
				<span class="mark">{{isNavOpened ? '✕' : '三'}}</span> MENU
			</button>
		</div>
		<div :class="{App__nav: true, open: isNavOpened}">
			<div class="App__nav-content">
				<Home/>
			</div>
		</div>
		<div class="App__view">
			<router-view/>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'

import Home from '@/pages/Home'

@Component({
	components: {Home}
})
export default class App extends Vue {
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

.App__nav
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

	&.open
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

.App__nav-content
	overflow scroll
	padding-top 3em
	height 100%

.App__title-bar
	position fixed
	top 0
	left 0
	z-index 1001
	width 100%
	height $title-bar-height
	background #222222

.App__hamburger
	width 10em
	height 100%
	background #333
	color white
	letter-spacing 0.3em
	cursor pointer

	.mark
		display inline-block
		overflow hidden
		width 1.2em
		height 1.2em
		vertical-align middle
		text-align center
		letter-spacing 0
		line-height 1em

	&:hover
		background var(--color-active)

.App__view
	padding-top $title-bar-height
	height 100%
</style>
