<template>
	<div class="ParamFieldSlider grow">
		<InputNumber class="param-field--1w" v-bind="$props" @input="onInput" @change="onChange"/>
		<InputSlider
			v-if="!compact"
			class="ParamFieldSlider__slider"
			:value="value"
			:min="min"
			:max="max"
			:step="step"
			@input="onInput"
			@change="onChange"
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
	@Prop(String) private prefix!: string
	@Prop(String) private unit!: string
	@Prop({type: Boolean, default: false}) private compact!: boolean

	private onInput(newValue: number) {
		this.$emit('input', newValue)
	}

	private onChange(newValue: number, oldValue: number) {
		this.$emit('change', newValue, oldValue)
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
