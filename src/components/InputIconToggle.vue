<template>
	<div class="InputIconToggle">
		<input
			class="InputIconToggle__input"
			type="checkbox"
			:checked="value"
			@change="$emit('input', $event.target.checked)"
			ref="input"
		>
		<Icon class="InputIconToggle__icon" v-if="value" :src="srcOn"/>
		<Icon class="InputIconToggle__icon" v-else :src="srcOff"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import Icon from './common/Icon.vue'
import {setButtonUnfocusableForMouse} from '../util'

@Component({
	components: {Icon}
})
export default class InputIconToggle extends Vue {
	@Prop({type: Boolean, required: true}) private value!: boolean
	@Prop({type: String, required: true}) private srcOn!: string
	@Prop({type: String, required: true}) private srcOff!: string

	private mounted() {
		setButtonUnfocusableForMouse(this.$refs.input as HTMLElement)
	}
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
		color var(--color-control)
		pointer-events none

		^[0]__input:checked + &
			color var(--color-control-text)

		^[0]__input:hover + &, ^[0]__input:focus + &, ^[0]__input:active + &
			color var(--color-active)
</style>

