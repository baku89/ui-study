<template>
	<div class="InputMatrix">
		<InputNumber
			v-for="(v, index) in value"
			:key="index"
			:class="inputClasses[index]"
			:value="v"
			:min="min instanceof Array ? min[index] : min"
			:max="max instanceof Array ? max[index] : max"
			:precision="precision"
			:label="labels ? labels[index] : undefined"
			:unit="unit"
			:style="inputStyles"
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
export default class InputMatrix extends Vue {
	@Prop({type: Array, required: true}) private value!: number[]
	@Prop({type: Number, required: true}) private columns!: number
	@Prop({type: Number, required: true}) private rows!: number
	@Prop(Number) private precision!: number
	@Prop([Number, Array]) private min!: number | number[]
	@Prop([Number, Array]) private max!: number | number[]
	@Prop(Array) private labels!: string[]
	@Prop(String) private unit!: string

	private get inputClasses(): string[] {
		const classes = []

		for (let i = 0; i < this.rows; i++) {
			let rowClass = 'InputMatrix__elm '
			if (i === 0) {
				rowClass += 'top'
			} else if (i === this.rows - 1) {
				rowClass += 'bottom'
			} else {
				rowClass += 'middle'
			}
			for (let j = 0; j < this.columns; j++) {
				let cls = rowClass + ' '
				if (j === 0) {
					cls += 'left'
				} else if (j === this.columns - 1) {
					cls += 'right'
				} else {
					cls += 'center'
				}
				classes.push(cls)
			}
		}

		return classes
	}

	private get inputStyles(): object {
		return {width: `${100 / this.columns}%`}
	}

	private onInput(index: number, value: number) {
		const newValue = Array.from(this.value)
		newValue[index] = value
		this.$emit('input', newValue, index)
	}
}
</script>

<style lang="stylus" scoped>
.InputMatrix
	display flex
	flex-wrap wrap

	&__elm
		flex-grow 1
</style>
