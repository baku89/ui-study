<template>
	<div class="InputRandomSeed">
		<InputNumber
			:value="value"
			:precision="0"
			@input="onInput"
			style="width: 6em; margin-right: 0.5em;"
		/>
		<InputIconButton @click="generateRandomSeed">
			<img svg-inline src="../assets/icon_refresh.svg">
		</InputIconButton>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputNumber from './InputNumber.vue'
import InputIconButton from './InputIconButton.vue'

@Component({
	components: {InputNumber, InputIconButton}
})
export default class InputRandomSeed extends Vue {
	@Prop(Number) private value!: number

	private onInput(newValue: number) {
		this.$emit('input', newValue)
	}

	private generateRandomSeed() {
		const newValue = Math.random() * 10000000
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.InputRandomSeed
	display flex
</style>
