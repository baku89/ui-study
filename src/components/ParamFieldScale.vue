<template>
	<div class="ParamFieldScale">
		<InputNumber
			v-if="isScalar"
			class="param-field--1w"
			:value="percentValue"
			:precision="precision"
			:max="max"
			:min="min"
			:step="step"
			:label="label"
			unit="%"
			@input="onInput"
		/>
		<template v-else>
			<InputVector
				class="param-field--2w"
				:value="percentValue"
				:precision="precision"
				:max="max"
				:min="min"
				:step="step"
				:labels="labels"
				unit="%"
				@input="onInput"
			/>
			<InputIconToggle
				:value="_keepProportion"
				@input="onChangeKeepProportion"
				src-on="./assets/icon_chain.svg"
				src-off="./assets/icon_unlinked-chain.svg"
			/>
		</template>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputNumber from './InputNumber.vue'
import InputVector from './InputVector.vue'
import InputIconToggle from './InputIconToggle.vue'

@Component({
	components: {InputNumber, InputVector, InputIconToggle}
})
export default class ParamFieldScale extends Vue {
	@Prop({type: [Number, Array], required: true}) private value!:
		| number
		| number[]
	@Prop([Number, Array]) private min!: number | number[]
	@Prop([Number, Array]) private max!: number | number[]
	@Prop(Number) private step!: number
	@Prop(Number) private precision!: number
	@Prop(String) private label!: string[]
	@Prop(Array) private labels!: string[]
	@Prop({type: Boolean, default: null}) private keepProportion!: boolean | null

	private internalKeepProportion: boolean | null = null

	private get isScalar(): boolean {
		return !(this.value instanceof Array)
	}

	private get percentValue(): number | number[] {
		return this.isScalar
			? (this.value as number) * 100
			: (this.value as number[]).map(v => v * 100)
	}

	private created() {
		if (this.keepProportion === null) {
			this.internalKeepProportion = true
		}
	}

	private get _keepProportion(): boolean {
		return this.keepProportion !== null
			? this.keepProportion
			: (this.internalKeepProportion as boolean)
	}

	private onInput(_newValue: number | number[], index: number) {
		let newValue

		if (this.isScalar) {
			newValue = (_newValue as number) / 100
		} else {
			newValue = (_newValue as number[]).map(v => v / 100)

			if (this._keepProportion) {
				const proportion = newValue[index] / (this.value as number[])[index]

				if (isFinite(proportion)) {
					for (let i = 0; i < newValue.length; i++) {
						newValue[i] =
							i === index
								? newValue[index]
								: (this.value as number[])[i] * proportion
					}
				} else {
					for (let i = 0; i < newValue.length; i++) {
						newValue[i] = newValue[index]
					}
				}
			}
		}

		this.$emit('input', newValue)
	}

	private onChangeKeepProportion(newValue: boolean) {
		if (this.keepProportion !== null) {
			this.$emit('update:keepProportion', newValue)
		} else {
			this.internalKeepProportion = newValue
		}
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParamFieldScale
	display flex
</style>
