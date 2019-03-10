<template>
	<div class="ParamFieldAffine">
		<InputMatrix
			class="param-field--3n"
			:value="value"
			:columns="3"
			:rows="2"
			:precision="1"
			:labels="['xx', null, 'tx', null, null, 'ty']"
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

.ParamFieldAffine
	display flex
</style>
