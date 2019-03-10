<template>
	<div class="ParamFieldRange">
		<InputVector
			:value="value"
			:precision="precision"
			:min="[min, value[0]]"
			:max="[value[1], max]"
			:unit="unit"
			@input="onInputVector"
			style="width: 6em; margin-right: 0.5em;"
		/>
		<InputRange class="ParamFieldRange__range" :value="value" :min="min" :max="max" @input="onInput"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputVector from './InputVector.vue'
import InputRange from './InputRange.vue'

@Component({
	components: {InputVector, InputRange}
})
export default class ParamFieldRange extends Vue {
	@Prop({type: Array, required: true}) private value!: [number, number]
	@Prop({type: Number, required: true}) private min!: number
	@Prop({type: Number, required: true}) private max!: number
	@Prop({type: Number, default: 0}) private precision!: number
	@Prop(Array) private labels!: string[]
	@Prop(String) private unit!: string

	private onInputVector(newValue: [number, number], index: number) {
		if (index === 0) {
			newValue[0] = Math.min(newValue[0], newValue[1])
		} else {
			newValue[1] = Math.max(newValue[0], newValue[1])
		}
		this.$emit('input', newValue)
	}

	private onInput(newValue: number) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParamFieldRange
	display flex

	&__range
		flex-grow 1
</style>
