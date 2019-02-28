<template>
	<button class="InputButton" @click="$emit('click', $event)">{{label}}</button>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class InputButton extends Vue {
	@Prop(String) private label!: string
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.InputButton
	height $input-height
	input-border-style()
	border-color var(--color-control)
	background transparent
	color var(--color-control-text)

	&:hover
		input-border-hover-style()

	&:active
		input-border-active-style()
		background var(--color-active)
		color var(--color-bg)
</style>
