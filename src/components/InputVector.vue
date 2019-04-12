<template>
	<div class="InputVector">
		<InputNumber
			v-for="(v, index) in value"
			:key="index"
			:class="index == 0 ? 'left' : (index == value.length - 1 ? 'right' : 'center')"
			:value="v"
			:min="min instanceof Array ? min[index] : min"
			:max="max instanceof Array ? max[index] : max"
			:step="step instanceof Array ? step[index] : step"
			:precision="precision"
			:label="labels ? labels[index] : undefined"
			:unit="unit"
			@input="onInput(index, $event)"
		/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import InputNumber from './InputNumber.vue'

@Component({
	components: {InputNumber}
})
export default class InputVector extends Vue {
	@Prop({type: Array, required: true}) private value!: number[]
	@Prop(Number) private precision!: number
	@Prop([Number, Array]) private min!: number | number[]
	@Prop([Number, Array]) private max!: number | number[]
	@Prop([Number, Array]) private step!: number | number[]
	@Prop(Array) private labels!: string[]
	@Prop(String) private unit!: string

	private onInput(index: number, value: number) {
		const newValue = Array.from(this.value)
		newValue[index] = value
		this.$emit('input', newValue, index)
	}
}
</script>

<style lang="stylus" scoped>
.InputVector
	display flex
</style>
