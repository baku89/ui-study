<template>
	<div class="ParamFieldAngle">
		<InputNumber
			:value="value"
			:precision="precision"
			:label="label"
			@input="onInput"
			unit="°"
			style="width: 6em; margin-right: 0.5em;"
		/>
		<InputAngle :value="value" @input="onInput"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputNumber from './InputNumber.vue'
import InputAngle from './InputAngle.vue'

@Component({
	components: {InputNumber, InputAngle}
})
export default class ParamFieldAngle extends Vue {
	@Prop(Number) private value!: number
	@Prop(Number) private precision!: number
	@Prop(String) private label!: string

	private onInput(newValue: number) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParamFieldAngle
	display flex
</style>
