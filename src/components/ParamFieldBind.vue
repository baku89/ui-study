<template>
	<div class="ParamFieldBind param-field--2w">
		<InputDropdown
			class="ParamFieldBind__source left"
			:values="['key', 'osc', 'midi']"
			:labels="['Key', 'OSC', 'MIDI']"
			theme="bind"
			:value="value.source"
			@input="updateSource"
		/>
		<InputString class="ParamFieldBind__address right" :value="address" @input="updateAddress"/>
		<button
			class="ParamFieldBind__detect-button"
			:class="{detecting: isDetecting}"
			@click="startDetect"
		/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'
import keycode from 'keycode'

import Bind from '../data/Bind'

import InputDropdown from './InputDropdown.vue'
import InputString from './InputString.vue'

@Component({
	components: {InputDropdown, InputString}
})
export default class ParamFieldBind extends Vue {
	@Prop({type: Object, required: true}) private value!: Bind

	private address: string | null = this.value.address

	private isDetecting: boolean = false

	@Watch('value', {deep: true})
	private onValueChanged(newValue: any) {
		this.address = this.value.address
	}

	private updateSource(source: string) {
		if (this.value.source !== source) {
			this.address = ''

			const newValue = new Bind(source, this.address)
			this.$emit('input', newValue)
		}
	}

	private updateAddress(address: string) {
		const newValue = new Bind(this.value.source, address)
		this.$emit('input', newValue)
	}

	private async startDetect(e: Event) {
		this.isDetecting = !this.isDetecting

		if (this.isDetecting) {
			const address = await this.value.detect()
			this.updateAddress(address)
			this.isDetecting = false
		}
	}
}
</script>


<style lang='stylus' scoped>
@import '../style/config.styl'

.ParamFieldBind
	position relative
	display flex

	&__source
		width 6em

	&__detect-button
		position absolute
		top 0
		right 0
		z-index 5
		visibility hidden
		margin calc(var(--layout-input-height) * 0.2)
		width calc(var(--layout-input-height) * 0.6)
		height calc(var(--layout-input-height) * 0.6)
		border 3px double var(--color-control)
		border-radius 50%

		&:hover
			border-style solid
			border-color var(--color-active)

		*:hover + &, &:hover
			visibility visible

		&.detecting
			visibility visible
			border none
			background red
</style>