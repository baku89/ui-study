<template>
	<div class="wrapper">
		<input type="checkbox" :value="value" @change="$emit('input', $event.target.checked)">
		<div class="img" :style="imgStyle" ref="img">
			<slot/>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class InputCheckbox extends Vue {
	@Prop(Boolean) private value!: boolean
	@Prop(String) private src!: string

	private imgStyle: object = {}

	private mounted() {
		const imgWrapper = this.$refs.img as HTMLElement
		const img = imgWrapper.firstChild as HTMLElement
		const scale = imgWrapper.clientWidth / img.clientWidth

		this.imgStyle = {transform: `scale(${scale})`}
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.wrapper
	position relative
	width $input-height
	height $input-height

input, .img
	top 10%
	left 10%
	width 80%
	height 80%

input
	position relative
	display block
	border-radius $border-radius

	&:hover
		background var(--color-border)

		& + .img
			fill var(--color-control)

.img
	position absolute
	transform-origin 0 0
	pointer-events none
	fill var(--color-border)

input:checked + .img
	fill var(--color-control-text)

input:active + .img
	fill var(--color-active)
</style>

