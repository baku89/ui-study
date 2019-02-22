<template>
	<div class="ParameterScale">
		<InputVector
			:value="value"
			:precision="precision"
			:unit="unit"
			@input="onInput"
			style="width: 12em; margin-right: 0.5em;"
		/>
		<InputIconToggle :value="keepProportion" @input="$emit('update:keepProportion', $event)">
			<img svg-inline src="../assets/icon_chain.svg">
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
export default class ParameterScale extends Vue {
	@Prop(Array) private value!: number[]
	@Prop(Number) private precision!: number
	@Prop(String) private label!: string
	@Prop(String) private unit!: string
	@Prop({type: Boolean, default: true}) private keepProportion!: boolean

	private onInput(newValue: number[], index: number) {
		if (this.keepProportion) {
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
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParameterScale
	display flex
</style>
