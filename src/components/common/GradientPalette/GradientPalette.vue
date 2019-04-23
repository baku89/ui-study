<template>
	<canvas/>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import * as twgl from 'twgl.js'

import {DataColor, DataColorMode} from '../../../data'

@Component
export default class GradientPalette extends Vue {
	private static gl: WebGLRenderingContext
	private static programInfo: twgl.ProgramInfo
	private static bufferInfo: twgl.BufferInfo

	@Prop(Array) private color!: DataColor
	@Prop(Array) private varyings!: number[]

	private ctx!: CanvasRenderingContext2D
	private canvas!: HTMLCanvasElement

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

	@Watch('color')
	private onColorChanged() {
		this.renderPad()
	}

	@Watch('varyings')
	private onVaryingsChanged() {
		this.renderPad()
	}

	private renderPad() {
		twgl.resizeCanvasToDisplaySize(this.canvas)

		if (this.canvas.width === 0 || this.canvas.height === 0) {
			return
		}

		const {gl, programInfo, bufferInfo} = GradientPalette

		gl.canvas.width = this.canvas.width
		gl.canvas.height = this.canvas.height
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

		const uniforms = {
			resolution: [gl.canvas.width, gl.canvas.height],
			mode: this.getModeIndex(this.color[0], this.varyings),
			elements: this.color[1]
		}

		gl.useProgram(programInfo.program)
		twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
		twgl.setUniforms(programInfo, uniforms)
		twgl.drawBufferInfo(gl, bufferInfo)

		this.ctx.drawImage(gl.canvas, 0, 0, this.canvas.width, this.canvas.height)
	}

	private getModeIndex(mode: DataColorMode, varyings: number[]): number {
		const varyingHash = varyings.join('-')

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

		switch (mode) {
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
}
</script>
