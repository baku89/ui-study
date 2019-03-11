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
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputMatrix from './InputMatrix.vue'

@Component({
	components: {InputMatrix}
})
export default class ParamFieldAffine extends Vue {
	@Prop(Array) private value!: number[]
	@Prop(Number) private precision!: number

	private onInput(newValue: number[]) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'
</style>
