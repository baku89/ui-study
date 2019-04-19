<template>
	<div class="TimelineColor">
		<canvas class="TimelineColor__canvas" ref="canvas"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'

@Component
export default class TimelineColor extends Vue {
	@Prop({type: Uint8ClampedArray, required: true})
	private value!: Uint8ClampedArray
	@Prop({type: Array, required: true}) private displayRange!: [number, number]

	private ctx!: CanvasRenderingContext2D

	@Watch('displayRange')
	public renderColors() {
		const [start, end] = this.displayRange

		const displayDuration = end - start + 1

		this.ctx.canvas.width = displayDuration

		// Copy imageDatas
		const data = this.value.subarray(start * 4, (end + 1) * 4)
		const imageData = new ImageData(data, displayDuration, 1)
		this.ctx.putImageData(imageData, 0, 0)
	}

	private mounted() {
		const canvas = this.$refs.canvas as HTMLCanvasElement

		const ctx = canvas.getContext('2d')

		if (ctx === null) {
			throw Error('Cannot get 2D context')
			return
		}

		this.ctx = ctx

		canvas.height = 1
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
.TimelineColor
	position relative
	height 2em

	&__canvas
		width 100%
		height 100%
		image-rendering pixelated
</style>



