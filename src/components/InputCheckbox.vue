<template>
	<div class="InputCheckbox">
		<input
			class="InputCheckbox__input"
			type="checkbox"
			:id="id"
			:checked="value"
			@change="$emit('input', $event.target.checked)"
		>
		<label class="InputCheckbox__label" v-if="label !== undefined" :for="id">{{label}}</label>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import uid from 'uid'

@Component
export default class InputCheckbox extends Vue {
	@Prop(Boolean) private value!: boolean
	@Prop(String) private label!: string

	private id: string = uid(10)
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.InputCheckbox
	position relative
	display flex
	height var(--input-height)
	// background red

.InputCheckbox__input
	position relative
	display block
	input-border-style()
	margin-top calc(var(--input-height) * 0.2)
	margin-right 0.4em
	width calc(var(--input-height) * 0.6)
	height calc(var(--input-height) * 0.6)

	&:hover
		input-border-hover-style()

	&:active, &:focus
		input-border-focus-style()

	&:checked:before
		position absolute
		top 0
		left 0
		width 100%
		height 100%
		color var(--color-control-text)
		content '✓'
		text-align center
		font-size 1.1em
		line-height 1em

	&:hover, &:active, &:focus
		&:before
			color var(--color-active)

.InputCheckbox__label
	height var(--input-height)
	line-height var(--input-height)
</style>

