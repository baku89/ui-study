<template>
	<div class="ParamFieldColor">
		<InputColorButton class="param-field--color-button" :value="value" @input="onInput"/>
		<InputColor class="param-field--3n" :value="value" @input="onInput"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import {DataColor} from '../data'

import InputColor from './InputColor'
import InputColorButton from './InputColorButton.vue'

@Component({
	components: {InputColor, InputColorButton}
})
export default class ParamFieldColor extends Vue {
	@Prop(Array) private value!: DataColor

	private onInput(newValue: number[]) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParamFieldColor
	display flex
</style>
