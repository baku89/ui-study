<template>
	<div class="wrapper">
		<template v-if="isHex">
			<InputString
				class="left"
				:value="hasAlpha ? value[1][0] : value[1]"
				:validator="validateColorHex"
				@input="hasAlpha ? onInputElement(0, $event) : onInputElement(null, $event)"
			/>
			<InputColorElement
				v-if="hasAlpha"
				class="right"
				:value="value[1]"
				:varying="1"
				:mode="value[0]"
				:min="0"
				:max="elementMax[1]"
				:label="elementLabels[1]"
				:unit="elementUnits[1]"
				@input="onInputElement(1, $event)"
			/>
		</template>
		<template v-else>
			<InputColorElement
				class="left"
				:value="value[1]"
				:varying="0"
				:mode="value[0]"
				:min="0"
				:max="elementMax[0]"
				:label="elementLabels[0]"
				:unit="elementUnits[0]"
				@input="onInputElement(0, $event)"
			/>
			<InputColorElement
				class="middle"
				:value="value[1]"
				:varying="1"
				:mode="value[0]"
				:min="0"
				:max="elementMax[1]"
				:label="elementLabels[1]"
				:unit="elementUnits[1]"
				@input="onInputElement(1, $event)"
			/>
			<InputColorElement
				:class="hasAlpha ? 'middle' : 'right'"
				:value="value[1]"
				:varying="2"
				:mode="value[0]"
				:min="0"
				:max="elementMax[2]"
				:label="elementLabels[2]"
				:unit="elementUnits[2]"
				@input="onInputElement(2, $event)"
			/>
			<InputColorElement
				v-if="hasAlpha"
				class="right"
				:value="value[1]"
				:varying="3"
				:mode="value[0]"
				:min="0"
				:max="elementMax[3]"
				:label="elementLabels[3]"
				:unit="elementUnits[3]"
				@input="onInputElement(3, $event)"
			/>
		</template>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputColorElement from './InputColorElement.vue'
import InputString from '@/components/InputString.vue'

import {DataColor, DataColorMode, DataColorInfo} from '@/data'

@Component({
	components: {InputColorElement, InputString}
})
export default class InputColor extends Vue {
	@Prop(Array) private value!: DataColor

	get elementMax(): number[] {
		const mode = this.value[0]
		return DataColorInfo.maxValue[mode]
	}

	get elementLabels(): string[] {
		const mode = this.value[0]
		return DataColorInfo.label[mode]
	}

	get elementUnits(): Array<string | undefined> {
		const mode = this.value[0]
		return DataColorInfo.unit[mode]
	}

	get hasAlpha(): boolean {
		return this.value[0].indexOf('a') !== -1
	}

	get isHex(): boolean {
		return this.value[0].indexOf('hex') !== -1
	}

	private validateColorHex(value: string): string | false {
		if (/^#?(?:[0-9A-F]{3}){1,2}$/i.test(value)) {
			if (!value.startsWith('#')) {
				console.log('dont start with #')
				value = '#' + value
				console.log(value)
			}
			return value.toUpperCase()
		} else {
			return false
		}
	}

	private onInputElement(index: number, element: number | string) {
		let elements
		if (index === null) {
			elements = element
		} else {
			elements = Array.from(this.value[1])
			elements[index] = element
		}

		const newValue = [this.value[0], elements]

		this.$emit('input', newValue)
	}
}
</script>

<style lang="stylus" scoped>
.wrapper
	display flex
</style>
