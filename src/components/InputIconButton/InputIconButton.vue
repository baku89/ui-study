<template>
	<div class="InputIconButton">
		<button class="InputIconButton__input" v-on="$listeners" ref="button"/>
		<Icon class="InputIconButton__icon" :src="src"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import Icon from '../common/Icon.vue'
import {setButtonUnfocusableForMouse} from '../../util'

@Component({
	components: {Icon}
})
export default class InputIconButton extends Vue {
	@Prop({type: String, required: true}) private src!: string

	private mounted() {
		setButtonUnfocusableForMouse(this.$refs.button as HTMLElement)
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

.InputIconButton
	position relative
	width var(--layout-input-height)
	height var(--layout-input-height)

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
		color var(--color-control)
		pointer-events none

		^[0]__input:hover + &, ^[0]__input:focus + &
			color var(--color-active)

		^[0]__input:active + &
			color var(--color-bg)
</style>

