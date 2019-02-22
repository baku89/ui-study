<template>
	<div class="page-content">
		<div class="column">
			<InputNumber v-model="scalar" unit="%" style="width: 6em; margin-right: 1em;"/>
			<InputSlider v-model="scalar" :min="0" :max="100" style="width: 12em"/>
		</div>

		<div class="column">
			<InputVector v-model="point" :precision="1" style="width: 12em; margin-right: .5em;"/>
			<InputPoint v-model="point"/>
		</div>

		<div class="column">
			<InputVector
				:value="scale"
				@input="onScaleChanged"
				:precision="1"
				style="width: 12em; margin-right: .5em;"
			/>
			<InputIconToggle v-model="keepPropotion">
				<img svg-inline src="../assets/icon_chain.svg">
			</InputIconToggle>
		</div>

		<div class="column">
			<InputVector v-model="rect" :precision="0" :labels="['T', 'R', 'B', 'L']" style="width: 16em;"/>
		</div>

		<div class="column">
			<InputColorButton v-model="color" style="margin-right: .3em;"/>
			<InputColor v-model="color" style="width: 9.7em;"/>
		</div>

		<div class="column">
			<InputString v-model="text" style="width: 12em;"/>
			<label>{{text}}</label>
		</div>

		<div class="column">
			<InputVector
				v-model="range"
				:precision="0"
				:units="['%', '%']"
				style="width: 6em; margin-right: 1em;"
			/>
			<InputRange v-model="range" :min="0" :max="100" style="width: 12em"/>
		</div>

		<div class="column">
			<InputNumber v-model="angle" label="R" unit="°" style="width: 6em; margin-right: .5em;"/>
			<InputAngle v-model="angle"/>
		</div>

		<div class="column">
			<InputCheckbox v-model="checkbox" label="Checkbox"/>
		</div>

		<div class="column">
			<InputMode
				v-model="direction"
				:labels="['Vertical', 'Horizontal']"
				:values="['vertical', 'horizontal']"
			/>
		</div>

		<div class="column">
			<InputDropdown
				v-model="dropdown"
				:labels="['Top', 'Right', 'Bottom', 'Left']"
				:values="['top', 'right', 'bottom', 'left']"
				style="width:6em"
			/>
		</div>

		<div class="column">
			<InputButton @click="angle += 10" :label="'Button'"/>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

import {DataColor} from '@/data'

import Components from '@/components'

@Component({
	components: Components,
	data() {
		return {
			scalar: 76,
			point: [10, 20],
			scale: [100, 50],
			keepPropotion: false,
			rect: [10, 20, 30, 40],
			range: [10, 70],
			text: 'foobar',
			dropdown: 'bottom',
			color: ['hsl', [20, 30, 20]],
			angle: 0,
			checkbox: true,
			direction: 'horizontal'
		}
	}
})
export default class ComponentsList extends Vue {
	private onScaleChanged(value: number[], index: number) {
		const scale = this.$data.scale

		if (this.$data.keepPropotion) {
			const proportion = value[index] / scale[index]

			console.log(value, index, proportion)

			if (isFinite(proportion)) {
				for (let i = 0; i < scale.length; i++) {
					this.$set(
						scale,
						i,
						i === index ? value[index] : scale[i] * proportion
					)
				}
			} else {
				for (let i = 0; i < scale.length; i++) {
					this.$set(scale, i, value[index])
				}
			}
		} else {
			this.$data.scale = value
		}
	}
}
</script>

<style lang="stylus">
.page-content
	padding 2rem
	width 100%
	height 100%
	background var(--color-bg)
	user-select none

.column
	display flex
	margin-bottom 0.8em

label
	padding 0 0.2em
	line-height $input-height
</style>
