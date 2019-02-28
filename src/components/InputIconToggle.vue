<template>
	<div class="InputIconToggle">
		<input
			class="InputIconToggle__input"
			type="checkbox"
			:checked="value"
			@change="$emit('input', $event.target.checked)"
		>
		<div class="InputIconToggle__img" :style="imgStyles" ref="img">
			<slot/>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class InputIconToggle extends Vue {
	@Prop({type: Boolean, required: true}) private value!: boolean

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

.InputIconToggle
	position relative
	width $input-height
	height $input-height

.InputIconToggle__input, .InputIconToggle__img
	top 10%
	left 10%
	width 80%
	height 80%

.InputIconToggle__input
	position relative
	display block
	border-radius $border-radius

	&:hover
		background var(--color-border)

		& + .InputIconToggle__img
			fill var(--color-control)

.InputIconToggle__img
	position absolute
	transform-origin 0 0
	pointer-events none
	fill var(--color-border)

	.InputIconToggle__input:checked + &
		fill var(--color-control-text)

	.InputIconToggle__input:active + &
		fill var(--color-active)
</style>

