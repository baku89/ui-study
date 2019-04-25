<template>
	<div class="ParamFieldPoint">
		<InputVector
			class="param-field--2w"
			:value="value"
			:precision="precision"
			:max="max"
			:min="min"
			:step="step"
			:unit="unit"
			@input="onInput"
		/>
		<InputPoint :value="value" @input="onInput"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputVector from './InputVector.vue'
import InputPoint from './InputPoint.vue'

@Component({
	components: {InputVector, InputPoint}
})
export default class ParamFieldPoint extends Vue {
	@Prop(Array) private value!: number[]
	@Prop(Number) private precision!: number
	@Prop([Number, Array]) private min!: number | number[]
	@Prop([Number, Array]) private max!: number | number[]
	@Prop(Number) private step!: number
	@Prop(String) private label!: string
	@Prop(String) private unit!: string
	@Prop({type: Boolean, default: true}) private keepProportion!: boolean

	private onInput(newValue: number[]) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParamFieldPoint
	display flex
</style>
