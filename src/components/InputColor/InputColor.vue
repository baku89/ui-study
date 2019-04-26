<template>
	<div class="InputColor">
		<InputString
			v-if="isHex"
			class="left"
			:value="value.elements"
			:validator="validateColorHex"
			:style="{fontFamily: 'var(--font-monospace)'}"
			@input="hupdateHexElement"
		/>
		<template v-else>
			<InputColorElement
				class="left"
				:color="value"
				:varying="0"
				@update:element="updateElement(0, $event)"
			/>
			<InputColorElement
				class="center"
				:color="value"
				:varying="1"
				@update:element="updateElement(1, $event)"
			/>
			<InputColorElement
				class="right"
				:color="value"
				:varying="2"
				@update:element="updateElement(2, $event)"
			/>
		</template>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputColorElement from './InputColorElement.vue'
import InputString from '../InputString.vue'

import Color from '../../data/Color'

@Component({
	components: {InputColorElement, InputString}
})
export default class InputColor extends Vue {
	@Prop({type: Object, required: true}) private value!: Color
	@Prop({type: Boolean, default: true}) private showLabel!: boolean

	private get isHex(): boolean {
		return this.value.mode === 'hex'
	}

	private validateColorHex(value: string): string | false {
		if (/^#?(?:[0-9A-F]{3}){1,2}$/i.test(value)) {
			if (!value.startsWith('#')) {
				console.warn('dont start with #')
				value = '#' + value
			}
			return value.toUpperCase()
		} else {
			return false
		}
	}

	private updateHexElement(hex: string) {
		const newValue = this.value.clone()
		newValue.elements = hex
		this.$emit('input', newValue)
	}

	private updateElement(index: number, element: number) {
		const newValue = this.value.clone()
		const elements = newValue.elements as number[]
		elements[index] = element
		this.$emit('input', newValue)
	}
}
</script>

<style lang="stylus" scoped>
.InputColor
	display flex
	user-select none
</style>
