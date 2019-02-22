<template>
	<div class="ParameterColor">
		<InputColorButton :value="value" @input="onInput" style="width: 3.7em; margin-right: 0.3em;"/>
		<InputColor :value="value" @input="onInput" style="width: 12em;"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import {DataColor} from '@/data'

import InputColor from './InputColor'
import InputColorButton from './InputColorButton.vue'

@Component({
	components: {InputColor, InputColorButton}
})
export default class ParameterColor extends Vue {
	@Prop(Array) private value!: DataColor

	private onInput(newValue: number[]) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParameterColor
	display flex
</style>
