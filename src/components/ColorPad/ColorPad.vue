<template>
	<canvas :id="id" ref="canvas"/>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import uid from 'uid'
import * as twgl from 'twgl.js'

import {DataColor, DataColorMode} from '@/data'

let renderCanvas: HTMLCanvasElement
let gl: WebGLRenderingContext
let programInfo: twgl.ProgramInfo
let bufferInfo: twgl.BufferInfo

function getModeIndex(mode: DataColorMode, varyings: number[]): number {
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
	}

	return index
}

const ConstantMax = {
	rg: 255,
	gb: 255,
	br: 255,
	hs: 100,
	sl: 360,
	lh: 100
}

@Component
export default class ColorPad extends Vue {
	@Prop(Array) private color!: DataColor
	@Prop(Array) private varyings!: number[]

	private id: string = uid(10)

	private ctx!: CanvasRenderingContext2D
	private canvas!: HTMLCanvasElement

	private mounted() {
		if (!renderCanvas) {
			renderCanvas = document.createElement('canvas')
			gl = renderCanvas.getContext('webgl') as WebGLRenderingContext

			programInfo = twgl.createProgramInfo(gl, [
				require('!raw-loader!./color-pad.vert'),
				require('!raw-loader!./color-pad.frag')
			])

			const arrays = {
				position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]
			}
			bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)
		}

		this.canvas = this.$refs.canvas as HTMLCanvasElement
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

		gl.canvas.width = this.canvas.width
		gl.canvas.height = this.canvas.height
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

		const uniforms = {
			resolution: [gl.canvas.width, gl.canvas.height],
			mode: getModeIndex(this.color[0], this.varyings),
			elements: this.color[1]
		}

		gl.useProgram(programInfo.program)
		twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
		twgl.setUniforms(programInfo, uniforms)
		twgl.drawBufferInfo(gl, bufferInfo)

		this.ctx.drawImage(
			renderCanvas,
			0,
			0,
			this.canvas.width,
			this.canvas.height
		)
	}
}
</script>

<style lang="stylus" scoped>
@import '../../style/config.styl'
</style>

