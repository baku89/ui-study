<template>
	<div class="page-content">
		<div class="param">
			<div class="param__column">
				<div class="input-label param__label">Intensity</div>
				<ParameterSlider class="param__input" v-model="intensity" :min="0" :max="200" unit="%"/>
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
				<div class="input-label param__label">Crop</div>
				<ParameterScale
					v-model="crop"
					:precision="0"
					:max="100"
					:min="0"
					:labels="['T', 'R', 'B', 'L']"
					unit="%"
					style="width: 16em;"
				/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Frame Color</div>
				<ParameterColor v-model="frameColor"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Range</div>
				<ParameterRange class="param__input" v-model="range" unit="%" :min="0" :max="100"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Angle</div>
				<ParameterAngle class="param__input" v-model="angle"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Seed</div>
				<InputRandomSeed class="param__input" v-model="seed"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Feedback</div>
				<InputCheckbox v-model="checkbox"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Coordinate</div>
				<InputMode v-model="direction" :labels="['Rect', 'Polar']" :values="[0, 1]"/>
			</div>

			<div class="param__column">
				<div class="input-label param__label">Direction</div>
				<InputDropdown
					v-model="dropdown"
					:labels="['Top', 'Right', 'Bottom', 'Left']"
					:values="['top', 'right', 'bottom', 'left']"
					style="width:6em"
				/>
			</div>

			<div class="param__column">
				<InputButton :label="'Reset'"/>
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
	components: Components,
	data() {
		return {
			range: [10, 70],
			dropdown: 'bottom',
			angle: 0,
			checkbox: true,
			seed: 1705734,
			direction: 0
		}
	}
})
export default class ParameterControl extends Vue {
	private intensity = 50
	private speed = 1
	private offset = [0, 0]
	private scale = [100, 100]
	private keepProportion = true
	private crop = [10, 10, 10, 10]
	private frameColor: DataColor = ['hsl', [20, 30, 20]]

	private renderer!: ISFRenderer

	private mounted() {
		const canvas = this.$refs.canvas as HTMLCanvasElement
		const gl = canvas.getContext('webgl2')
		this.renderer = new ISFRenderer(gl)
		this.renderer.loadSource(require('./polar-disp.frag'))

		const img = new Image()
		img.src = './assets/page-link_01.png'
		img.onload = () => {
			console.log(img)
			this.renderer.setValue('inputImage', img)
		}

		this.updateCrop()
		this.updateFrameColor()

		let lastTime = performance.now()
		let deltaTime = 0
		let time = 0

		const draw = (currentTime: number) => {
			deltaTime = currentTime - lastTime
			time += (deltaTime * this.speed) / 4000000
			twgl.resizeCanvasToDisplaySize(canvas)
			this.renderer.setValue('time', time)
			this.renderer.draw(canvas)

			lastTime = time
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
}
</script>

<style lang="stylus">
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
		background red
</style>
