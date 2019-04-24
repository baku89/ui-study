<template>
	<div class="InputDropdown" :class="[theme]" :editing="isEditing">
		<select
			class="InputDropdown__select"
			:value="value"
			@focus="isEditing = true"
			@blur="isEditing = false"
			@change="onChange"
		>
			<option
				v-for="(value, index) in values"
				:key="index"
				:value="value"
			>{{labels ? labels[index] : value}}</option>
		</select>
		<div class="InputDropdown__arrow">▼</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

type ValueType = string | number

@Component
export default class InputDropdown extends Vue {
	@Prop([String, Number]) private value!: ValueType
	@Prop(Array) private values!: ValueType[]
	@Prop(Array) private labels!: string[]
	@Prop(String) private theme!: string

	private isEditing: boolean = false

	private onChange(e: Event) {
		const {selectedIndex} = e.target as HTMLSelectElement
		const newValue = this.values[selectedIndex]

		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

$right-arrow-width = 1em

.InputDropdown
	position relative
	height var(--layout-input-height)
	input-placement-modifier-root()

	&.left
		z-index 1
		margin-right -1px

		&:hover
			z-index 2

		&:active, &:focus
			z-index 3

	&__select
		width 100%
		input-border-style()
		input-field-style()
		input-placement-modifier-border('^[0]', ' &')
		padding-right $right-arrow-width
		padding-left 0.4em
		font-family var(--font-normal)
		line-height 'calc(%s - 2px)' % var(--layout-input-height)

		&:hover
			z-index 2

		&:active, &:focus
			z-index 3

		^[0].simple > &
			border none
			background none

		^[0].bind > &
			background var(--color-border)
			color var(--color-control-text)
			text-align-last center

		&:hover, &:active
			color var(--color-active)

		&:hover
			input-border-hover-style()

		&:focus
			input-border-focus-style()

	&__arrow
		position absolute
		top 0
		right 0
		display block
		width $right-arrow-width
		height var(--layout-input-height)
		color var(--color-border-text)
		text-align center
		font-size 1em
		line-height 'calc(%s - 2px)' % var(--layout-input-height)
		transform scale(0.7)
		pointer-events none

		^[0]__select:hover + &, ^[0]__select:focus + &
			color var(--color-active)
</style>

