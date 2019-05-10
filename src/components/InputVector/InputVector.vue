<template>
	<div class="InputVector">
		<InputNumber
			v-for="(v, index) in value"
			:key="index"
			:class="index == 0 ? 'left' : (index == value.length - 1 ? 'right' : 'center')"
			:value="v"
			:min="Array.isArray(min) ? min[index] : min"
			:max="Array.isArray(max) ? max[index] : max"
			:step="Array.isArray(step) ? step[index] : step"
			:precision="precision"
			:showSign="showSign"
			:label="labels ? labels[index] : undefined"
			:unit="unit"
			@input="onInput(index, $event)"
			@startChange="onStartChange"
			@change="onChange"
		/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import InputNumber from '../InputNumber'

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
	@Prop(Boolean) private showSign!: boolean

	private startValue!: number[]

	private created() {
		this.startValue = [...this.value]
	}

	private onInput(index: number, value: number) {
		const newValue = this.value
		this.$set(newValue, index, value)
		this.$emit('input', newValue, index)
	}

	private onStartChange() {
		this.startValue = [...this.value]
	}

	private onChange() {
		const newValue = [...this.value]
		this.$emit('change', newValue, this.startValue)
	}
}
</script>

<style lang="stylus" scoped>
.InputVector
	display flex
</style>
