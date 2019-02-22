<template>
	<div class="ParameterPoint">
		<InputVector
			:value="value"
			:precision="precision"
			:unit="unit"
			@input="onInput"
			style="width: 12em; margin-right: 0.5em;"
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
export default class ParameterPoint extends Vue {
	@Prop(Array) private value!: number[]
	@Prop(Number) private precision!: number
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

.ParameterPoint
	display flex
</style>
