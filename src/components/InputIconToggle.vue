<template>
	<div class="InputIconToggle">
		<ButtonWrapper>
			<input
				class="InputIconToggle__input"
				type="checkbox"
				:checked="value"
				@change="$emit('input', $event.target.checked)"
			>
		</ButtonWrapper>
		<div class="InputIconToggle__icon">
			<slot v-if="value" name="checked"/>
			<slot v-else name="unchecked"/>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import ButtonWrapper from '@/components/common/ButtonWrapper'

@Component({
	components: {ButtonWrapper}
})
export default class InputIconToggle extends Vue {
	@Prop({type: Boolean, required: true}) private value!: boolean
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.InputIconToggle
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

	&__icon
		position absolute
		pointer-events none
		fill var(--color-control)

		& > *
			width 100%
			height 100%

		^[0]__input:checked + &
			fill var(--color-control-text)

		^[0]__input:hover + &, ^[0]__input:focus + &, ^[0]__input:active + &
			fill var(--color-active)
</style>

