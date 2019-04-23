<template>
	<div class="InputColor">
		<template v-if="isHex">
			<InputString
				class="left"
				:value="hasAlpha ? value[1][0] : value[1]"
				:validator="validateColorHex"
				:style="{fontFamily: 'var(--font-monospace)'}"
				@input="hasAlpha ? updateElement(0, $event) : updateElement(null, $event)"
			/>
			<InputColorElement
				v-if="hasAlpha"
				class="right"
				:color="value"
				:varying="1"
				@input="updateElement(1, $event)"
			/>
		</template>
		<template v-else>
			<InputColorElement class="left" :color="value" :varying="0" @input="updateElement(0, $event)"/>
			<InputColorElement class="center" :color="value" :varying="1" @input="updateElement(1, $event)"/>
			<InputColorElement
				:class="hasAlpha ? 'center' : 'right'"
				:color="value"
				:varying="2"
				@input="updateElement(2, $event)"
			/>
			<InputColorElement
				v-if="hasAlpha"
				class="right"
				:color="value"
				:varying="3"
				@input="updateElement(3, $event)"
			/>
		</template>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputColorElement from './InputColorElement.vue'
import InputString from '../InputString.vue'

import {DataColor, DataColorMode, DataColorInfo} from '../../data'

@Component({
	components: {InputColorElement, InputString}
})
export default class InputColor extends Vue {
	@Prop(Array) private value!: DataColor
	@Prop({type: Boolean, default: true}) private showLabel!: boolean

	private get hasAlpha(): boolean {
		return this.value[0].indexOf('a') !== -1
	}

	private get isHex(): boolean {
		return this.value[0].indexOf('hex') !== -1
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

	private updateElement(index: number, element: number | string) {
		const elements = Array.from(this.value[1])
		elements[index] = element
		const newValue = [this.value[0], elements]
		this.$emit('input', newValue)
	}
}
</script>

<style lang="stylus" scoped>
.InputColor
	display flex
	user-select none
</style>
