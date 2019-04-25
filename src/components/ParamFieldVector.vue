<template>
	<div class="ParamFieldVector param-field--2w">
		<InputVector :value="value" :precision="precision" :unit="unit" @input="onInput"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputVector from './InputVector.vue'

@Component({
	components: {InputVector}
})
export default class ParamFieldVector extends Vue {
	@Prop(Array) private value!: number[]
	@Prop(Number) private precision!: number
	@Prop(String) private label!: string
	@Prop(String) private unit!: string

	private onInput(newValue: number[]) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'
</style>
