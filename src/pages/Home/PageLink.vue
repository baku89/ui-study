<template>
	<section class="PageLink">
		<component
			:is="wrapperType"
			:class="{PageLink__link: true, clickable: linkType !== null, draft: linkType === null, external: linkType === 'external'}"
			:to="linkType === 'internal' ? to : undefined"
			:href="linkType === 'external' ? to : undefined"
		>
			<h2 class="PageLink__title">
				<span class="outline">{{numbering}}</span>
				{{title}}
			</h2>
			<p class="PageLink__desc">
				<slot/>
			</p>
			<img v-if="thumb" class="PageLink__img" :src="thumb">
		</component>
	</section>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator'

type LinkType = 'internal' | 'external' | null

@Component
export default class Home extends Vue {
	@Prop({type: String, required: true}) private numbering!: string
	@Prop({type: String, required: true}) private title!: string
	@Prop(String) private to!: string
	@Prop(String) private thumb!: string

	private get wrapperType(): string {
		switch (this.linkType) {
			case 'internal':
				return 'router-link'
			case 'external':
				return 'a'
			default:
				return 'div'
		}
	}

	private get linkType(): LinkType {
		if (!this.to) {
			return null
		} else if (this.to.startsWith('/')) {
			return 'internal'
		} else {
			return 'external'
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '../../style/common.styl'

.PageLink
	&__link
		display block
		padding 0.5em

		&.clickable
			border 1px solid transparent
			border-radius $border-radius-large

			&:hover
				border-color var(--color-active)
				box-shadow 0 0 0 2px white, 0 0 0 3px var(--color-active)
				color var(--color-active)

			&:active
				box-shadow 0 0 0 2px white, 0 0 0 4px var(--color-active)

			&:hover, &:active
				.outline
					text-stroke-color var(--color-active)
					-webkit-text-stroke-color var(--color-active)

		h2^[0]__title
			^[-1].draft &, ^[-1].external &
				&:after
					display inline-block
					margin-left 0.5em
					padding 0.2em 0.4em
					border-radius 0.2em
					background #bbb
					color white
					vertical-align bottom
					font-weight normal
					font-size 0.7em

				.outline
					text-stroke-color #bbb
					-webkit-text-stroke-color #bbb

			^[-1].draft &
				color #bbb

				&:after
					content 'Draft'

			^[-1].external &
				&:after
					content 'External Link'

	p&__desc
		margin-bottom 1.2em
		color inherit

	&__img
		display block
		width 100%
		border-radius $border-radius-large
</style>
