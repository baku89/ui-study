<template>
	<div class="ParamFieldSeed">
		<InputNumber
			class="param-field--1w"
			:value="value"
			:precision="0"
			:min="min"
			:max="max"
			:step="step"
			@input="onInput"
		/>
		<InputIconButton @click="generateRandomSeed" src="./assets/icon_refresh.svg"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import {lerp} from '../math'

import InputNumber from './InputNumber.vue'
import InputIconButton from './InputIconButton.vue'

@Component({
	components: {InputNumber, InputIconButton}
})
export default class ParamFieldSeed extends Vue {
	@Prop({type: Number, required: true}) private value!: number
	@Prop(Number) private min!: number
	@Prop(Number) private max!: number
	@Prop(Number) private step!: number
	@Prop(Number) private preision!: number

	private onInput(newValue: number) {
		this.$emit('input', newValue)
	}

	private generateRandomSeed() {
		let newValue
		if (this.step !== null) {
			newValue =
				Math.floor(
					lerp(this.min, this.max + this.step, Math.random()) / this.step
				) * this.step
		} else {
			newValue = lerp(this.min, this.max, Math.random())
		}
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParamFieldSeed
	display flex
</style>
