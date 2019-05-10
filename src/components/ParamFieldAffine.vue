<template>
	<div class="ParamFieldAffine">
		<InputMatrix
			class="param-field--3n"
			:value="value"
			:columns="3"
			:rows="2"
			direction="column"
			:precision="1"
			:labels="['a', 'b', 'c', 'd', 'tx', 'ty']"
			@input="onInput"
		/>
	</div>
</template>

<script lang="ts">
import {Component, Provide, Prop, Vue} from 'vue-property-decorator'

import InputMatrix from './InputMatrix'

@Component({
	components: {InputMatrix}
})
export default class ParamFieldAffine extends Vue {
	@Prop(Array) private value!: number[]
	@Prop(Number) private precision!: number

	@Provide() private dragSpeed = 0.01

	private onInput(newValue: number[]) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'
</style>
