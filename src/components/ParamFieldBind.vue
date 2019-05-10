<template>
	<div class="ParamFieldBind param-field--2w">
		<InputDropdown
			class="ParamFieldBind__device left bind"
			:values="['key', 'osc', 'midi', 'gamepad']"
			:labels="['K️ey', 'OSC', 'MIDI', '🎮']"
			:value="device"
			@input="updateDevice"
		/>
		<InputString class="ParamFieldBind__address right" :value="path" @input="updatePath"/>
		<button
			class="ParamFieldBind__detect-button"
			:class="{detecting: detecting}"
			@click="toggleDetect"
		/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'
import keycode from 'keycode'

import InputDropdown from './InputDropdown.vue'
import InputString from './InputString.vue'
import BindManager from '../manager/BindManager'

@Component({
	components: {InputDropdown, InputString}
})
export default class ParamFieldBind extends Vue {
	@Prop({type: String, required: true})
	private value!: string
	@Prop(String) private detectType!: 'press' | 'change'

	private detecting: boolean = false

	private get device(): string {
		return this.value.substr(1).split(/\/(.+)/)[0]
	}

	private get path(): string {
		return this.value.substr(1).split(/\/(.+)/)[1] || ''
	}

	private updateDevice(device: string) {
		if (this.path !== '') {
			const newValue = `/${device}/${this.path}`
			this.$emit('input', newValue)
		}
	}

	private updatePath(path: string) {
		const newValue = `/${this.device}/${path}`
		this.$emit('input', newValue)
	}

	private async toggleDetect(e: Event) {
		this.detecting = !this.detecting

		if (this.detecting) {
			let newValue
			try {
				newValue = await BindManager.detect(this.detectType)
			} catch (err) {
				this.detecting = false
				return
			}
			this.$emit('input', newValue)
			this.detecting = false
		} else {
			BindManager.abortDetection()
		}
	}

	private onDetectionAborted() {
		this.detecting = false
	}
}
</script>


<style lang='stylus' scoped>
@import '../style/config.styl'

$rec-color = #ff254e

.ParamFieldBind
	position relative
	display flex

	&__device
		width 6em

	&__address
		width 100%

	&__detect-button
		position absolute
		top 0
		right 0
		z-index 5
		visibility hidden
		margin calc(var(--layout-input-height) * 0.25)
		width calc(var(--layout-input-height) * 0.5)
		height calc(var(--layout-input-height) * 0.5)
		border 1px dashed $rec-color
		border-radius 50%

		&:hover
			border-style solid
			border-color $rec-color
			background $rec-color

		*:hover + &, &:hover
			visibility visible

		&:active
			box-shadow 0 0 0 1px $rec-color

		&.detecting
			visibility visible
			border none
			background $rec-color
			box-shadow 0 0 0 1px $rec-color
			animation recording 0.3s ease 0s infinite alternate

@keyframes recording
	0%
		opacity 1

	100%
		opacity 0.3
</style>