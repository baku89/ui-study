<template>
	<div class="InputIconAction">
		<select class="InputIconAction__select" @change="onChange" :value='null'>
			<option
				v-for="(value, index) in values"
				:key="index"
				:value="value"
			>{{labels ? labels[index] : value}}</option>
		</select>
		<div class="InputIconAction__icon" :style="iconStyles" ref="icon">
			<slot/>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

type ValueType = string | number

@Component
export default class InputIconAction extends Vue {
	@Prop(Array) private values!: ValueType[]
	@Prop(Array) private labels!: string[]

	private iconStyles: object = {}

	private mounted() {
		const iconWrapper = this.$refs.icon as HTMLElement
		const icon = iconWrapper.firstChild as HTMLElement
		const scale = iconWrapper.clientWidth / icon.clientWidth

		this.iconStyles = {transform: `scale(${scale})`}
	}

	private onChange(e: Event) {
		const {selectedIndex} = e.target as HTMLSelectElement
		const newValue = this.values[selectedIndex]

		this.$emit('click', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

$right-arrow-width = 1em

.InputIconAction
	position relative
	width $input-height
	height $input-height

	&__icon
		position absolute
		top 10%
		left 10%
		width 80%
		height 80%
		pointer-events none
		fill var(--color-control)

	&:hover, &:active
		&:after
			color var(--color-active)

	&__select
		width 100%
		height 100%
		position relative
		display block
		border-radius $border-radius
		text-indent 100%

		^[0]:hover > &
			input-border-hover-style()

		^[0]:active > &
			input-border-focus-style()
</style>

