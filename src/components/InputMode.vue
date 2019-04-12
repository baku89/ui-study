<template>
	<form class="InputMode">
		<div class="InputMode__option" v-for="(v, index) in values" :key="index">
			<input
				class="InputMode__radio"
				type="radio"
				:name="id"
				:checked="values[index] === value"
				@click="onClick(v)"
			>
			<label class="InputMode__label">{{labels ? labels[index] : v}}</label>
		</div>
	</form>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import uid from 'uid'

type ValueType = string | number | symbol

@Component
export default class InputMode extends Vue {
	@Prop() private value!: ValueType
	@Prop(Array) private values!: ValueType[]
	@Prop(Array) private labels!: string[]

	private id: string = uid(10)

	private onClick(v: ValueType) {
		this.$emit('input', v)
	}
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.InputMode
	position relative
	display flex
	height $input-height
	border 1px solid var(--color-border)
	border-radius $border-radius
	background var(--color-border)

	&__option
		position relative
		z-index 1
		margin -1px -1px -1px 0
		height $input-height
		color var(--color-border-text)
		line-height 'calc(%s - 2px)' % $input-height

		&:first-child
			margin-left -1px

		&:hover
			z-index 2

	&__radio
		position absolute
		top 0
		left 0
		width 100%
		height 100%
		opacity 0.5

	&__label
		display block
		padding 0 0.8em
		height $input-height
		border 1px solid transparent
		border-radius $border-radius

		^[0]__radio:checked + &
			border-color var(--color-border)
			background var(--color-bg)
			color var(--color-text)

		^[0]__radio:hover + &
			border-color var(--color-active)

		^[0]__radio:active + &
			background var(--color-active)
			color var(--color-bg)

		^[0]__radio:focus + &
			input-border-focus-style()
</style>

