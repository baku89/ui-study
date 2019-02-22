<template>
	<div class="ParameterSlider">
		<InputNumber
			:value="value"
			:precision="precision"
			:unit="unit"
			@input="onInput"
			style="width: 6em; margin-right: 0.5em;"
		/>
		<InputSlider
			class="ParameterSlider__slider"
			:value="value"
			:min="min"
			:max="max"
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
export default class ParameterSlider extends Vue {
	@Prop(Number) private value!: number
	@Prop(Number) private precision!: number
	@Prop(Number) private min!: number
	@Prop(Number) private max!: number
	@Prop(String) private label!: string
	@Prop(String) private unit!: string

	private onInput(newValue: number) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParameterSlider
	display flex

	&__slider
		flex-grow 1
</style>
