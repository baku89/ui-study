<template>
	<div class="ParameterRange">
		<InputVector
			:value="value"
			:precision="precision"
			:unit="unit"
			@input="onInput"
			style="width: 6em; margin-right: 0.5em;"
		/>
		<InputRange class="ParameterRange__range" :value="value" :min="min" :max="max" @input="onInput"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputVector from './InputVector.vue'
import InputRange from './InputRange.vue'

@Component({
	components: {InputVector, InputRange}
})
export default class ParameterRange extends Vue {
	@Prop(Array) private value!: number[]
	@Prop({type: Number, default: 0}) private precision!: number
	@Prop(Number) private min!: number
	@Prop(Number) private max!: number
	@Prop(Array) private labels!: string[]
	@Prop(String) private unit!: string

	private onInput(newValue: number) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParameterRange
	display flex

	&__range
		flex-grow 1
</style>
