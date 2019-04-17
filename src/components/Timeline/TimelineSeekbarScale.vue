
<template>
	<div class="TimelineSeekbarScale">
		<div
			class="TimelineSeekbarScale__scale"
			v-for="{id, left, text} in scales"
			:key="id"
			:style="{left}"
		>{{text}}</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'
import {ratio} from '../../math'
import Timecode from '../../util/Timecode'

@Component
export default class TimelineSeekbarScale extends Vue {
	@Prop({type: Array, required: true})
	private displayRange!: [number, number]

	@Inject({from: 'fps', default: 24}) private readonly fps!: number

	private scales: Array<{id: number; left: string; text: string}> = []

	private mounted() {
		this.updateScale()
	}

	@Watch('displayRange')
	private updateScale() {
		const [start, end] = this.displayRange

		const framesPerPixel =
			(this.displayRange[1] - this.displayRange[0]) / this.$el.clientWidth

		let step = framesPerPixel * 40

		if (step < this.fps) {
			const exp = Math.max(Math.ceil(Math.log2(step)), 0)
			step = Math.min(this.fps, Math.pow(2, exp))
		} else {
			const stepInSec = step / this.fps
			step =
				([5, 10, 30, 60, 300, 600].find(sec => stepInSec < sec) || 600) *
				this.fps
		}

		let frames = Math.ceil(start / step) * step

		this.scales.splice(0, this.scales.length)

		for (; frames <= end; frames += step) {
			const left = ratio(frames, start, end + 1) * 100 + '%'
			const text = Timecode.formatSimple(frames, this.fps)
			this.scales.push({id: frames, left, text})
		}
	}
}
</script>


<style lang="stylus" scoped>
$font-size = 0.9em

.TimelineSeekbarScale
	position absolute
	bottom 0
	width 100%
	height 1em

	&__scale
		position absolute
		top 0
		padding-left 0.2em
		height 100%
		border-left 1px solid var(--color-control)
		color var(--color-control-text)
		font-size $font-size
		font-family var(--font-monospace)
		line-height $font-size
</style>



