<template>
	<button class="InputButton" v-on="$listeners">
		<slot/>
	</button>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class InputButton extends Vue {}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.InputButton
	height $input-height
	input-border-style()
	input-field-style()
	padding 0 0.5em
	border-color var(--color-control)
	background transparent
	color var(--color-control-text)

	&:hover, &:focus
		input-border-hover-style()

	&:active
		input-border-active-style()
		background var(--color-active)
		color var(--color-bg)
</style>
