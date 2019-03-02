<template>
	<div class="page-content">
		<div class="param">
			<div class="param__column">
				<div class="input-label param__label">Intensity</div>
				<ParameterSlider class="param__input" v-model="intensity" :min="0" :max="100"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Iteration</div>
				<ParameterSlider class="param__input" v-model="iteration" :min="1" :max="5" :precision="0"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Speed</div>
				<ParameterSlider class="param__input" v-model="speed" :min="-10" :max="10"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Offset</div>
				<ParameterPoint v-model="offset" :precision="1" unit="%"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Scale</div>
				<ParameterScale v-model="scale" :keepProportion.sync="keepProportion"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Angle</div>
				<ParameterAngle class="param__input" v-model="angle"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Crop</div>
				<ParameterScale
					v-model="crop"
					:precision="0"
					:max="50"
					:min="0"
					:labels="['T', 'R', 'B', 'L']"
					unit="%"
					class="crop"
				/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Frame Color</div>
				<ParameterColor v-model="frameColor"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Noise Type</div>
				<InputMode v-model="noiseType" :labels="['Simplex', 'Periodic']" :values="[0, 1]"/>
			</div>

			<div class="param__column">
				<InputButton label="Reset" @click="time = 0"/>
			</div>
		</div>
		<div class="preview">
			<div class="preview__wrapper">
				<canvas class="preview__canvas" ref="canvas"/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import raf from 'raf'

import {DataColor} from '@/data'
import {convertColorElements} from '@/util'

import Components from '@/components'

@Component({
	components: Components
})
export default class ParameterControl extends Vue {
	private intensity = 20
	private iteration = 2
	private speed = 1
	private offset = [0, 0]
	private scale = [30, 30]
	private angle = 0
	private keepProportion = true
	private crop = [5, 5, 5, 5]
	private frameColor: DataColor = ['hsl', [28, 100, 87]]
	private noiseType: number = 0

	private time!: number
}
</script>

<style lang="stylus" scoped>
.page-content
	display flex
	padding 2rem
	width 100%
	height 100%
	background var(--color-bg)
	user-select none

.param
	margin-right 1em
	width 30em

	&__column
		display flex
		margin-bottom 0.8em

	&__label
		padding 0 0.2em
		width 7em

	&__input
		flex-grow 1

	.crop .InputVector
		width 16em !important

.preview
	position relative
	flex-grow 1

	&__wrapper
		position relative
		padding-top 100%
		height 0

	&__canvas
		position absolute
		top 0
		left 0
		width 100%
		height 100%
</style>
