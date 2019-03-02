<template>
	<div class="InputIconButton">
		<button class="InputIconButton__input" v-on="$listeners"/>
		<div class="InputIconButton__img" :style="imgStyles" ref="img">
			<slot/>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class InputIconButton extends Vue {
	private imgStyles: object = {}

	private mounted() {
		const imgWrapper = this.$refs.img as HTMLElement
		const img = imgWrapper.firstChild as HTMLElement
		const scale = imgWrapper.clientWidth / img.clientWidth

		this.imgStyles = {transform: `scale(${scale})`}
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.InputIconButton
	position relative
	width $input-height
	height $input-height

.InputIconButton__input, .InputIconButton__img
	top 10%
	left 10%
	width 80%
	height 80%

.InputIconButton__input
	position relative
	display block
	border-radius $border-radius

	&:hover
		background var(--color-border)

		& + .InputIconButton__img
			fill var(--color-control)

.InputIconButton__img
	position absolute
	transform-origin 0 0
	pointer-events none
	fill var(--color-border)

	.InputIconButton__input:checked + &
		fill var(--color-control-text)

	.InputIconButton__input:active + &
		fill var(--color-active)
</style>

