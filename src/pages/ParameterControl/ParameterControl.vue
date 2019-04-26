<template>
	<SelectionManager>
		<LayoutSplitter class="page-content" split="vertical" default="30em" min="30em" max="60%">
			<template slot="first">
				<div class="control">
					<LayoutTabs class="tabs">
						<LayoutTab label="Control" class="tab-control">
							<Parameter v-for="param of params" :key="param.name" :label="param.label">
								<component
									:is="'ParamField' + param.type[0].toUpperCase() + param.type.substr(1, param.type.length - 1)"
									v-model="param.value"
									:min="param.min"
									:max="param.max"
									:step="param.step"
									:precision="param.precision"
									:values="param.values"
									:labels="param.labels"
									:unit="param.unit"
								/>
							</Parameter>
						</LayoutTab>
						<LayoutTab label="Code">
							<LayoutSplitter class="tab-code" split="horizontal" default="50%">
								<template slot="first">
									<div class="code-wrapper">
										<InputCodeEditor class="code first" v-model="codeShader" lang="glsl"/>
									</div>
								</template>
								<template slot="second">
									<div class="code-wrapper">
										<InputCodeEditor class="code second" v-model="codeMeta" lang="json"/>
									</div>
								</template>
							</LayoutSplitter>
						</LayoutTab>
					</LayoutTabs>
				</div>
			</template>
			<template slot="second">
				<div class="preview">
					<canvas class="preview__canvas" ref="canvas"/>
				</div>
			</template>
		</LayoutSplitter>
	</SelectionManager>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import * as twgl from 'twgl.js'
// @ts-ignore
import {Renderer as ISFRenderer} from 'interactive-shader-format'

import Color, {ColorMode} from '../../data/Color'

import Components from '../../components'
import {toRadians} from '../../math'

interface ParamData {
	name: string
	value: number | number[] | Color
	type: string
	label: string
	min?: any
	max?: any
	precision?: number
	step?: number
	default?: any
	unit?: string
	values?: any[]
	labels?: string[]
}

@Component({
	components: Components
})
export default class ParameterControl extends Vue {
	private codeShader: string = require('./polar-disp.frag')
	private codeMeta: string = require('raw-loader!./polar-disp.meta.txt')

	private params: ParamData[] = []
	private isRendering: boolean = false

	// private time!: number
	private renderer!: ISFRenderer
	private shouldReset!: boolean
	private gl!: WebGL2RenderingContext

	private mounted() {
		const canvas = this.$refs.canvas as HTMLCanvasElement
		this.gl = canvas.getContext('webgl2') as WebGL2RenderingContext
		this.updateShader()
	}

	private setupDraw() {
		const canvas = this.$refs.canvas as HTMLCanvasElement
		this.renderer = new ISFRenderer(this.gl)

		// Compile
		const log = console.log
		// @ts-ignore
		console.log = () => false
		this.renderer.loadSource(`/*${this.codeMeta}*/\n${this.codeShader}`)
		console.log = log

		if (this.renderer.error) {
			console.error(this.renderer)
			this.isRendering = false
			return
		}

		// Parse params
		{
			this.params.splice(0, this.params.length)

			const {INPUTS: inputs} = JSON.parse(this.codeMeta)

			for (const input of inputs) {
				let type = 'number'
				let step
				let dim = 1
				let value = input.DEFAULT

				const hasRange = input.MIN !== undefined && input.MAX !== undefined

				if (input.TYPE === 'float') {
					dim = 1
					if (input.UI_TYPE === 'angle') {
						type = 'angle'
					} else if (hasRange) {
						type = 'slider'
					} else {
						type = 'number'
					}
				} else if (input.TYPE === 'point2D') {
					dim = 2
					if (input.UI_TYPE === 'scale') {
						type = 'scale'
					} else {
						type = 'point'
					}
				} else if (input.TYPE === 'long') {
					dim = 1
					if (input.UI_TYPE === 'integer') {
						type = hasRange ? 'slider' : 'number'
						step = 1
					} else if (input.UI_TYPE === 'mode') {
						type = 'mode'
					} else {
						type = 'dropdown'
					}
				} else if (input.TYPE === 'color') {
					dim = 3
					type = 'color'
				}

				if (value === undefined) {
					if (input.TYPE === 'color') {
						value = ['hsv', [0, 0, 100]]
					} else {
						value = dim === 1 ? 0 : Array(dim).fill(0)
					}
				}

				const param: ParamData = {
					name: input.NAME,
					label: input.LABEL !== undefined ? input.LABEL : input.NAME,
					type,
					value,
					default: value,
					min: input.MIN,
					max: input.MAX,
					step,
					unit: input.UNIT,
					values: input.VALUES,
					labels: input.LABELS
				}

				// @ts-ignore
				Object.keys(param).forEach(
					// @ts-ignore
					key => param[key] === undefined && delete param[key]
				)

				this.params.push(param)
			}
		}

		// let lastTime = performance.now()
		// let deltaTime = 0
		// this.time = 0
		this.isRendering = true

		const draw = (currentTime: number) => {
			if (!this.isRendering) {
				return
			}
			if (this.shouldReset) {
				this.shouldReset = false
				this.setupDraw()
				return
			}

			// Update Time
			// deltaTime = currentTime - lastTime
			// this.time += (deltaTime * this.speed) / 10000
			// this.renderer.setValue('TIME', this.time)
			// lastTime = currentTime

			twgl.resizeCanvasToDisplaySize(canvas)
			// canvas.width =
			// 	Math.min(canvas.clientWidth, canvas.clientHeight) *
			// 	window.devicePixelRatio
			// canvas.height = canvas.width
			this.renderer.draw(canvas)

			requestAnimationFrame(draw)
		}
		draw(performance.now())
	}

	private updateShader() {
		if (this.renderer) {
			this.renderer.cleanup()
			this.renderer = null
		}

		if (this.isRendering) {
			this.shouldReset = true
		} else {
			this.setupDraw()
		}
	}

	private beforeDestroy() {
		this.renderer.cleanup()
		this.renderer = null
		this.isRendering = false
	}

	@Watch('params', {deep: true})
	private onParamsChanged(newParams: ParamData[]) {
		for (const param of newParams) {
			const {type, unit, name} = param
			let {value} = param

			if (type === 'angle') {
				value = toRadians(value as number)
			} else if (type === 'color') {
				const color = value as Color
				let rgb = Color.convertMode(color, 'rgb').elements as number[]
				rgb = rgb.map((x: number) => x / 255)
				rgb.push(1)
				value = rgb
			} else if (type !== 'scale' && unit === '%') {
				if (value instanceof Array) {
					value = (value as number[]).map(v => v / 100)
				} else {
					value = (value as number) / 100
				}
			}

			this.renderer.setValue(name, value)
		}
	}

	@Watch('code')
	private onCodeChanged() {
		this.updateShader()
	}
}
</script>

<style lang="stylus" scoped>
.page-content
	// display flex
	align-items stretch
	width 100%
	height 100%
	background var(--color-bg)
	user-select none

.control
	height 100%

.tabs
	height 100%

.tab-control
	padding 1em

.tab-code
	width 100%
	height 100%

.code-wrapper
	position relative
	height 100%

.code
	position absolute
	top 0.4em
	right 0.4em
	bottom 0.4em
	left 0.4em

	&.first
		bottom 0.2em

	&.second
		top 0.2em

.preview
	position relative
	height 100%

	&__canvas
		width 100%
		height 100%
		background white
		object-fit contain
		// object-position 100% 0
</style>
