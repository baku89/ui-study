<template>
	<input type="text" :value="value" @change="onChange" ref="input">
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class InputString extends Vue {
	@Prop(String) private value!: string
	@Prop(Function) private validator!: (value: string) => string | false

	private onChange() {
		const input = this.$refs.input as HTMLInputElement
		let newValue = input.value

		if (this.validator) {
			const validatedValue = this.validator(newValue)
			if (validatedValue !== false) {
				newValue = validatedValue
				input.value = newValue
			} else {
				input.value = this.value
				return
			}
		}

		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

input
	input-border-style()
	input-field-style()
	font-family var(--font-normal)

	&:hover
		input-border-hover-style()

	&:focus
		input-border-focus-style()
</style>

