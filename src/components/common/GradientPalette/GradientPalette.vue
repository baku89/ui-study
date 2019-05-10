<template>
	<canvas/>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import * as twgl from 'twgl.js'

import Color, {ColorMode} from '../../../data/Color'

@Component
export default class GradientPalette extends Vue {
	private static gl: WebGLRenderingContext
	private static programInfo: twgl.ProgramInfo
	private static bufferInfo: twgl.BufferInfo

	@Prop({type: Object, required: true}) private color!: Color
	@Prop({type: Array, required: true}) private varyings!: number[]

	private ctx!: CanvasRenderingContext2D
	private canvas!: HTMLCanvasElement
	private uniforms!: any
	private oldElements!: number[]

	private get constants(): number[] {
		return Array(3)
			.fill(0)
			.map((_: number, i: number) => i)
			.filter((i: number) => !this.varyings.includes(i))
	}

	private get modeIndex(): number {
		const varyingHash = this.varyings.join('-')

		let index = 0
		switch (varyingHash) {
			case '0':
				index = 0
				break
			case '1':
				index = 1
				break
			case '2':
				index = 2
				break
			case '0-1':
				index = 3
				break
			case '1-2':
				index = 4
				break
			case '0-2':
				index = 5
				break
		}

		switch (this.color.mode) {
			case 'hsl':
				index += 10
				break
			case 'rgb':
				index += 20
				break
			case 'hsv':
				index += 30
				break
		}

		return index
	}

	private created() {
		this.uniforms = {
			resolution: [0, 0],
			mode: 0,
			elements: null
		}
		this.oldElements = [0, 0, 0]
	}

	private mounted() {
		if (!GradientPalette.gl) {
			const canvas = document.createElement('canvas')
			GradientPalette.gl = canvas.getContext('webgl') as WebGLRenderingContext

			GradientPalette.programInfo = twgl.createProgramInfo(GradientPalette.gl, [
				require('./gradient-palette.vert'),
				require('./gradient-palette.frag')
			])

			const arrays = {
				position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]
			}
			GradientPalette.bufferInfo = twgl.createBufferInfoFromArrays(
				GradientPalette.gl,
				arrays
			)
		}

		this.canvas = this.$el as HTMLCanvasElement
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

		this.renderPad()
	}

	@Watch('color', {deep: true})
	private onColorChanged() {
		const changed = false
		for (const i of this.constants) {
			if (this.color.elements[i] !== this.oldElements[i]) {
				this.renderPad()
				break
			}
		}
	}

	@Watch('varyings')
	private onVaryingsChanged() {
		this.renderPad()
	}

	private renderPad() {
		this.oldElements[0] = this.color.elements[0] as number
		this.oldElements[1] = this.color.elements[1] as number
		this.oldElements[2] = this.color.elements[2] as number

		twgl.resizeCanvasToDisplaySize(this.canvas)

		if (this.canvas.width === 0 || this.canvas.height === 0) {
			return
		}

		const {gl, programInfo, bufferInfo} = GradientPalette

		gl.canvas.width = this.canvas.width
		gl.canvas.height = this.canvas.height
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

		this.uniforms.resolution[0] = gl.canvas.width
		this.uniforms.resolution[1] = gl.canvas.height
		this.uniforms.mode = this.modeIndex
		this.uniforms.elements = this.color.elements

		gl.useProgram(programInfo.program)
		twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
		twgl.setUniforms(programInfo, this.uniforms)
		twgl.drawBufferInfo(gl, bufferInfo)

		this.ctx.drawImage(gl.canvas, 0, 0, this.canvas.width, this.canvas.height)
	}
}
</script>
