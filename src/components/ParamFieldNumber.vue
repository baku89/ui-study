<template>
	<div class="ParamFieldNumber">
		<InputNumber
			class="param-field--1w"
			:value="value"
			:precision="precision"
			:min="min"
			:max="max"
			:step="step"
			:unit="unit"
			@input="onInput"
		/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputNumber from './InputNumber.vue'

@Component({
	components: {InputNumber}
})
export default class ParamFieldNumber extends Vue {
	@Prop({type: Number, required: true}) private value!: number
	@Prop(Number) private min!: number
	@Prop(Number) private max!: number
	@Prop(Number) private step!: number
	@Prop(Number) private precision!: number
	@Prop(String) private label!: string
	@Prop(String) private unit!: string

	private onInput(newValue: number) {
		this.$emit('input', newValue)
	}
}
</script>

<style lang="stylus" scoped></style>
