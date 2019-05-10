<template>
	<div class="ParamFieldColor" :class="{compact}">
		<InputColorButton class="ParamFieldColor__color-button" :value="value" @input="onInput"/>
		<InputColor v-if="!compact" class="param-field--3n" :value="value" @input="onInput"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import Color from '../data/Color'

import InputColor from './InputColor'
import InputColorButton from './InputColorButton'

@Component({
	components: {InputColor, InputColorButton}
})
export default class ParamFieldColor extends Vue {
	@Prop({type: Object, required: true}) private value!: Color
	@Prop({type: Boolean, default: false}) private compact!: boolean

	private onInput(newValue: number[]) {
		this.$emit('input', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../style/config.styl'

.ParamFieldColor
	display flex

	&__color-button
		margin-right var(--layout-param-field-gap-box)
		width 'calc(%s / 1.5 - %s)' % (var(--layout-param-field-1w) var(--layout-param-field-gap-box)) !important

		^[0].compact &
			margin-right 0
</style>
