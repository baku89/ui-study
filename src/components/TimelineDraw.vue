<template>
	<div class="TimelineDraw">
		<canvas class="TimelineDraw__canvas" ref="canvas"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'
import {lerp} from '../math'

type DrawFunc = (
	ctx: CanvasRenderingContext2D,
	frame: number,
	width: number,
	height: number
) => void

@Component
export default class TimelineDraw extends Vue {
	@Prop({type: Function, required: true}) private drawFunc!: DrawFunc
	@Prop({type: Array, required: true}) private displayRange!: [number, number]

	private ctx!: CanvasRenderingContext2D

	@Watch('displayRange')
	public renderColors() {
		const [start, end] = this.displayRange
		const canvas = this.ctx.canvas
		const duration = end - start + 1

		let pixelsPerFrame = canvas.clientWidth / duration

		const height = canvas.clientHeight
		canvas.height = height

		if (pixelsPerFrame >= 1) {
			// More than 1px
			pixelsPerFrame = Math.ceil(pixelsPerFrame)
			canvas.width = pixelsPerFrame * duration

			for (let f = start, x = 0; f <= end; f++, x += pixelsPerFrame) {
				this.drawFunc(this.ctx, f, pixelsPerFrame, height)
				this.ctx.translate(pixelsPerFrame, 0)
			}
		} else {
			// Less then 1px
			canvas.width = canvas.clientWidth
			for (let x = 0, f; x < canvas.width; x++) {
				f = Math.round(lerp(start, end, x / (canvas.width - 1)))
				this.drawFunc(this.ctx, f, 1, height)
				this.ctx.translate(1, 0)
			}
		}

		this.ctx.resetTransform()
	}

	private mounted() {
		const canvas = this.$refs.canvas as HTMLCanvasElement

		const ctx = canvas.getContext('2d')

		if (ctx === null) {
			throw Error('Cannot get 2D context')
			return
		}

		this.ctx = ctx

		canvas.height = canvas.clientHeight
		canvas.width = canvas.clientWidth

		this.renderColors = this.renderColors.bind(this)
		this.renderColors()

		window.addEventListener('resize', this.renderColors)
	}

	private beforeDestroy() {
		window.removeEventListener('resize', this.renderColors)
	}
}
</script>


<style lang="stylus" scoped>
.TimelineDraw
	position relative
	height 2em

	&__canvas
		width 100%
		height 100%
</style>



