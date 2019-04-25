<template>
	<input class="InputString" type="text" :value="value" v-on="inputListeners" ref="input">
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component({})
export default class InputString extends Vue {
	@Prop({type: String, required: true}) private value!: string
	@Prop(Function) private validator!: (value: string) => string | false

	private get inputListeners() {
		const listeners = Object.assign({}, this.$listeners, {
			change: this.onChange,
			input: undefined
		})
		delete listeners.input
		return listeners
	}

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

.InputString
	input-border-style()
	input-field-style()
	input-placement-modifier-root()
	input-placement-modifier-border()
	font-family var(--font-normal)

	&:hover
		input-border-hover-style()

	&:focus
		input-border-focus-style()
</style>

