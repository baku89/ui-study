<template>
	<div class="ParamFieldScale">
		<InputVector
			class="param-field--2w"
			:value="value"
			:precision="precision"
			:max="max"
			:min="min"
			:labels="labels"
			:unit="unit"
			@input="onInput"
		/>
		<InputIconToggle :value="_keepProportion" @input="onChangeKeepProportion">
			<img slot="checked" svg-inline src="../assets/icon_chain.svg">
			<img slot="unchecked" svg-inline src="../assets/icon_unlinked-chain.svg">
		</InputIconToggle>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputVector from './InputVector.vue'
import InputIconToggle from './InputIconToggle.vue'

@Component({
	components: {InputVector, InputIconToggle}
})
export default class ParamFieldScale extends Vue {
	@Prop({type: Array, required: true}) private value!: number[]
	@Prop([Number, Array]) private min!: number | number[]
	@Prop([Number, Array]) private max!: number | number[]
	@Prop(Number) private precision!: number
	@Prop(Array) private labels!: string[]
	@Prop(String) private unit!: string
	@Prop({type: Boolean, default: null}) private keepProportion!: boolean | null

	private internalKeepProportion: boolean | null = null

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

	private onInput(newValue: number[], index: number) {
		if (this._keepProportion) {
			const proportion = newValue[index] / this.value[index]

			if (isFinite(proportion)) {
				for (let i = 0; i < newValue.length; i++) {
					newValue[i] =
						i === index ? newValue[index] : this.value[i] * proportion
				}
			} else {
				for (let i = 0; i < newValue.length; i++) {
					newValue[i] = newValue[index]
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
