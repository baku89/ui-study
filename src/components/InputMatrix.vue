<template>
	<div :class="['InputMatrix', direction]" :style="{height: `calc(var(--input-height) * ${rows}`}">
		<InputNumber
			v-for="(v, index) in value"
			:key="index + 1"
			:class="elmAttrs[index].classes"
			:value="v"
			:min="min instanceof Array ? min[index] : min"
			:max="max instanceof Array ? max[index] : max"
			:precision="precision"
			:label="labels ? labels[index] : undefined"
			:unit="unit"
			:style="elmAttrs[index].styles"
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
	@Prop({type: String, default: 'row'}) private direction!: 'row' | 'column'
	@Prop(Number) private precision!: number
	@Prop([Number, Array]) private min!: number | number[]
	@Prop([Number, Array]) private max!: number | number[]
	@Prop(Array) private labels!: string[]
	@Prop(String) private unit!: string

	private get elmAttrs(): object[] {
		return Array(this.columns * this.rows)
			.fill(null)
			.map((v, i) => {
				let x, y
				const classes = ['InputMatrix__elm']

				if (this.direction === 'row') {
					x = i % this.columns
					y = Math.floor(i / this.columns)
				} else {
					x = Math.floor(i / this.rows)
					y = i % this.rows
				}

				if (x === 0) {
					classes.push('left')
				} else if (x === this.columns - 1) {
					classes.push('right')
				} else {
					classes.push('center')
				}

				if (y === 0) {
					classes.push('top')
				} else if (y === this.rows - 1) {
					classes.push('bottom')
				} else {
					classes.push('middle')
				}

				return {
					classes,
					styles: {
						width: `calc(100% / ${this.columns})`,
						'grid-column': x + 1,
						'grid-row': y + 1
					}
				}
			})
	}

	private onInput(index: number, value: number) {
		const newValue = Array.from(this.value)
		newValue[index] = value
		this.$emit('input', newValue, index)
	}
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.InputMatrix
	display flex
	flex-wrap wrap

	&.row
		flex-direction row

	&.column
		flex-direction column
</style>
