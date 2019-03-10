<template>
	<div class="page-content">
		<div class="param">
			<div class="param__column">
				<div class="input-label param__label">Intensity</div>
				<ParamFieldSlider class="param__input" v-model="intensity" :min="0" :max="100"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Iteration</div>
				<ParamFieldSlider class="param__input" v-model="iteration" :min="1" :max="5" :precision="0"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Speed</div>
				<ParamFieldSlider class="param__input" v-model="speed" :min="-10" :max="10"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Offset</div>
				<ParamFieldPoint v-model="offset" :precision="1" unit="%"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Scale</div>
				<ParamFieldScale v-model="scale" :keepProportion.sync="keepProportion"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Angle</div>
				<ParamFieldAngle class="param__input" v-model="angle"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Crop</div>
				<ParamFieldScale
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
				<ParamFieldColor v-model="frameColor"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Noise Type</div>
				<InputMode v-model="noiseType" :labels="['Simplex', 'Periodic']" :values="[0, 1]"/>
			</div>

			<div class="param__column">
				<InputButton @click="time = 0">Reset</InputButton>
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
import * as twgl from 'twgl.js'
// @ts-ignore
import {Renderer as ISFRenderer} from 'interactive-shader-format'

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

	private renderer!: ISFRenderer

	private mounted() {
		const canvas = this.$refs.canvas as HTMLCanvasElement
		const gl = canvas.getContext('webgl2')
		this.renderer = new ISFRenderer(gl)
		this.renderer.loadSource(require('./polar-disp.frag'))

		this.updateIntensity()
		this.updateIteration()
		this.updateOffset()
		this.updateScale()
		this.updateAngle()
		this.updateCrop()
		this.updateFrameColor()
		this.updateNoiseType()

		let lastTime = performance.now()
		let deltaTime = 0
		this.time = 0

		const draw = (currentTime: number) => {
			deltaTime = currentTime - lastTime
			this.time += (deltaTime * this.speed) / 10000
			twgl.resizeCanvasToDisplaySize(canvas)
			this.renderer.setValue('time', this.time)
			this.renderer.draw(canvas)

			lastTime = currentTime
			raf(draw)
		}
		draw(performance.now())
	}

	private beforeDestroy() {
		this.renderer.cleanup()
	}

	@Watch('intensity')
	private updateIntensity() {
		this.renderer.setValue('intensity', this.intensity / 100)
	}

	@Watch('iteration')
	private updateIteration() {
		this.renderer.setValue('iteration', Math.round(this.iteration))
	}

	@Watch('offset')
	private updateOffset() {
		this.renderer.setValue('offset', [
			this.offset[0] / 100,
			this.offset[1] / 100
		])
	}

	@Watch('scale')
	private updateScale() {
		this.renderer.setValue('scale', [this.scale[0] / 100, this.scale[1] / 100])
	}

	@Watch('angle')
	private updateAngle() {
		this.renderer.setValue('angle', (this.angle / 180) * Math.PI)
	}

	@Watch('crop')
	private updateCrop() {
		this.renderer.setValue('cropTop', this.crop[0] / 100)
		this.renderer.setValue('cropRight', this.crop[1] / 100)
		this.renderer.setValue('cropBottom', this.crop[2] / 100)
		this.renderer.setValue('cropLeft', this.crop[3] / 100)
	}

	@Watch('frameColor')
	private updateFrameColor() {
		let color = convertColorElements(
			this.frameColor[0],
			'rgb',
			this.frameColor[1]
		)
		color = (color as number[]).map((x: number) => x / 255)
		this.renderer.setValue('frameColor', [...color, 1])
	}

	@Watch('noiseType')
	private updateNoiseType() {
		this.renderer.setValue('noiseType', this.noiseType)
	}
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
