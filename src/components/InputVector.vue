<template>
	<div class="InputVector__root">
		<InputNumber
			v-for="(v, index) in value"
			:key="index"
			:class="index == 0 ? 'left' : (index == value.length - 1 ? 'right' : 'middle')"
			:value="v"
			:precision="precision"
			:label="labels ? labels[index] : undefined"
			:unit="units ? units[index] : undefined"
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
	@Prop(Array) private value!: number[]
	@Prop({type: Number, default: 1}) private precision!: number
	@Prop(Array) private labels!: string[]
	@Prop(Array) private units!: string[]

	private onInput(index: number, value: number) {
		const newValue = Array.from(this.value)
		newValue[index] = value
		this.$emit('input', newValue, index)
	}
}
</script>

<style lang="stylus" scoped>
.InputVector__root
	display flex
</style>
