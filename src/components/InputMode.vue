<template>
	<div class="wrapper">
		<div
			v-for="(v, index) in values"
			:class="{option: true, active: values[index] === value}"
			:key="index"
			@click="$emit('input', v)"
		>{{labels ? labels[index] : v}}</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

type ValueType = string | number | symbol

@Component
export default class InputMode extends Vue {
	@Prop() private value!: ValueType
	@Prop(Array) private values!: ValueType[]
	@Prop(Array) private labels!: string[]
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.wrapper
	position relative
	display flex
	height $input-height
	border 1px solid var(--color-border)
	border-radius $border-radius
	background var(--color-border)

.option
	position relative
	z-index 1
	margin -1px
	padding 0 0.8em
	height $input-height
	border 1px solid transparent
	border-radius $border-radius
	color var(--color-border-text)
	line-height 'calc(%s - 2px)' % $input-height

	&.active
		border-color var(--color-border)
		background var(--color-bg)
		color var(--color-text)

	&:hover
		z-index 2
		border-color var(--color-active)

	&:active
		background var(--color-active)
		color var(--color-bg)
</style>

