<template>
	<div class="InputIconButton">
		<ButtonWrapper>
			<button class="InputIconButton__input" v-on="$listeners"/>
		</ButtonWrapper>
		<div class="InputIconButton__icon">
			<slot/>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import ButtonWrapper from '@/components/common/ButtonWrapper'

@Component({
	components: {ButtonWrapper}
})
export default class InputIconButton extends Vue {}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.InputIconButton
	position relative
	width $input-height
	height $input-height

	&__input, &__icon
		top 10%
		left 10%
		width 80%
		height 80%

	&__input
		position relative
		display block
		border-radius $border-radius

		&:hover, &:focus
			background var(--color-border)

		&:active
			background var(--color-active)

	&__icon
		position absolute
		transform-origin 0 0
		pointer-events none
		fill var(--color-control)

		& + *
			width 100%
			height 100%

		^[0]__input:hover + &, ^[0]__input:focus + &
			fill var(--color-active)

		^[0]__input:active + &
			fill var(--color-bg)
</style>

