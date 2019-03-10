<template>
	<div class="ParamFieldSeed">
		<InputNumber class="param-field--1w" :value="value" :precision="0" @input="onInput"/>
		<InputIconButton @click="generateRandomSeed">
			<img svg-inline src="../assets/icon_refresh.svg">
		</InputIconButton>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import {lerp} from '@/math'

import InputNumber from './InputNumber.vue'
import InputIconButton from './InputIconButton.vue'

@Component({
	components: {InputNumber, InputIconButton}
})
export default class ParamFieldSeed extends Vue {
	@Prop({type: Number, required: false}) private value!: number
	@Prop({type: Number, default: 0}) private min!: number
	@Prop({type: Number, default: 1000000}) private max!: number
	@Prop({type: Number, default: null}) private step!: number

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
