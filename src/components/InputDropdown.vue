<template>
	<div :class="{InputDropdown__root: true, simple: theme === 'simple'}">
		<select class="InputDropdown__select" :value="value" @change="onChange">
			<option
				v-for="(value, index) in values"
				:key="index"
				:value="value"
			>{{labels ? labels[index] : value}}</option>
		</select>
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

.InputDropdown__root
	position relative
	height $input-height

	&:after
		position absolute
		top 0
		right 0
		display block
		width $right-arrow-width
		height $input-height
		color var(--color-border-text)
		content '▼'
		text-align center
		font-size 1em
		line-height 'calc(%s - 2px)' % $input-height
		transform scale(0.7)
		pointer-events none

	&:hover, &:active
		&:after
			color var(--color-active)

.InputDropdown__select
	width 100%
	input-border-style()
	input-field-style()
	padding-right $right-arrow-width
	font-family var(--font-normal)
	line-height 'calc(%s - 2px)' % $input-height

	.wrapper.simple > &
		border none
		background none

		&:hover, &:active
			color var(--color-active)

	.wrapper:hover > &
		input-border-hover-style()

	.wrapper:active > &
		input-border-focus-style()
</style>

