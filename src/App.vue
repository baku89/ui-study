<template>
	<div class="App__root">
		<div class="App__title-bar" @click="onClickMenu">
			<button class="App__hamburger">三 MENU</button>
		</div>
		<div :class="{App__nav: true, open: isNavOpened}">
			<div class="App__nav-content article">
				<h1>Concurrent UI</h1>

				<section>
					<p>
						<em>Concurrent UI</em> is a design language considering ideal interfaces for all designing processes, which
						<a
							href="https://baku89.com"
							target="_blank"
						>Baku Hashimoto</a> has been developing since 2019.
						The several demos showing below explain the way of thinking behind Concurrent UI and how it actually works.
					</p>
				</section>

				<section class="PageLink">
					<router-link class="PageLink__link" to="/components-list" @click.native="isNavOpened = false">
						<h2 class="PageLink__title">1. List of Components</h2>
						<p
							class="PageLink__desc"
						>Input fields to adjust parameters such as a slider, number input, rotery knob, and more.</p>
						<img class="PageLink__img" src="./assets/page-link_01.png">
					</router-link>
				</section>
			</div>
		</div>
		<div class="App__view">
			<router-view/>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'

@Component
export default class App extends Vue {
	private get isNavOpened(): boolean {
		return this.$route.path === '/'
	}
	private onClickMenu() {
		this.$router.push('/')
	}
}
</script>


<style lang="stylus">
@import './style/common.styl'
@import './style/article.styl'

$title-bar-height = 3em

html, body
	height 100%

.App__root
	position relative
	width 100%
	height 100%

.App__nav
	$dur = 0.15s
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
	margin 0 auto
	padding-top 3em
	max-width 40em

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

	&:hover
		background var(--color-active)

.App__view
	padding-top $title-bar-height
	height 100%

.PageLink
	padding 0.5em
	border 1px solid transparent
	border-radius $border-radius-large

	&:hover
		border-color var(--color-active)
		color var(--color-active)

	&:active
		box-shadow 0 0 0 1px var(--color-active)

	h2&__title
		margin-top 0.5em
		margin-bottom 0.7em
		font-size 1.2em

	&__img
		display block
		width 100%
		border-radius $border-radius-large

	p&__desc
		margin-bottom 1.2em
		color inherit
</style>
