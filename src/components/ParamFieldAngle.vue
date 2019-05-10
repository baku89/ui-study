<template>
	<div class="ParamFieldAngle">
		<InputNumber
			class="param-field--1w"
			:value="value"
			:precision="precision"
			:label="label"
			@input="onInput"
			unit="°"
		/>
		<InputAngle :value="value" @input="onInput"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputNumber from './InputNumber'
import InputAngle from './InputAngle'

@Component({
	components: {InputNumber, InputAngle}
})
export default class ParamFieldAngle extends Vue {
	@Prop(Number) private value!: number
	@Prop(Number) private precision!: number
	@Prop(String) private label!: string

	private onInput(newValue: number) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParamFieldAngle
	display flex
</style>
