<template>
	<div class="ParamFieldSlider">
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
		<InputSlider
			class="ParamFieldSlider__slider"
			:value="value"
			:min="min"
			:max="max"
			:step="step"
			@input="onInput"
		/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputNumber from './InputNumber.vue'
import InputSlider from './InputSlider.vue'

@Component({
	components: {InputNumber, InputSlider}
})
export default class ParamFieldSlider extends Vue {
	@Prop({type: Number, required: true}) private value!: number
	@Prop({type: Number, required: true}) private min!: number
	@Prop({type: Number, required: true}) private max!: number
	@Prop(Number) private step!: number
	@Prop(Number) private precision!: number
	@Prop(String) private label!: string
	@Prop(String) private unit!: string

	private onInput(newValue: number) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParamFieldSlider
	display flex

	&__slider
		flex-grow 1
</style>
