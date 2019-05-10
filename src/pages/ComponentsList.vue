<template>
	<SelectionManager>
		<div class="page-content article">
			<h2>
				Example
				<span class="outline">#1</span>
			</h2>
			<p>Slider, Scale, Position, and Color.</p>
			<div class="ui">
				<div class="param">
					<ParameterList v-model="ex1" :defaultSchemas="[ex1Schema]" :schema.sync="ex1UserSchema"/>
				</div>
				<div class="preview">
					<div class="aspect">
						<svg class="canvas" viewBox="0 0 100 100">
							<circle
								:fill="ex1.fill.cssColor"
								:stroke="ex1.stroke.cssColor"
								:stroke-width="ex1.strokeWidth"
								cx="0"
								cy="0"
								:r="ex1.radius"
								:transform="`translate(${ex1.position[0]}, ${ex1.position[1]}) scale(${ex1.scale[0]}, ${ex1.scale[1]})`"
							></circle>
						</svg>
					</div>
				</div>
			</div>
			<!-- 
			<h2>
				Example
				<span class="outline">#2</span>
			</h2>
			<p>String, Angle, and Range (min/max).</p>
			<div class="ui">
				<div class="param">
					<ParameterList v-model="ex2" :defaultSchema="ex2Schema" :schema.sync="ex2UserSchema"/>
				</div>
				<div class="preview">
					<div class="aspect">
						<svg class="canvas" viewBox="0 0 100 100">
							<text
								fill="#222"
								font-size="10"
								text-anchor="middle"
								dominant-baseline="central"
								:transform="`translate(50, 50) rotate(${ex2.rotation})`"
							>{{trimText(ex2.text, ...ex2.trim)}}</text>
						</svg>
					</div>
				</div>
			</div>

			<h2>
				Example
				<span class="outline">#3</span>
			</h2>
			<p>Dropdown, Checkbox, and Select.</p>
			<div class="ui">
				<div class="param">
					<ParameterList v-model="ex3" :defaultSchema="ex3Schema" :schema.sync="ex3UserSchema"/>
				</div>
				<div class="preview">
					<div class="aspect" :style="{filter: ex3.inverted ? 'invert(1)' : ''}">
						<img :class="['canvas', ex3.edge]" :src="`./assets/${ex3.image}.jpg`">
					</div>
				</div>
			</div>

			<h2>
				Example
				<span class="outline">#4</span>
			</h2>
			<p>Random seed, Button.</p>
			<div class="ui">
				<div class="param">
					<Parameter label="Roll">
						<ParamFieldSeed v-model="ex4.seed" :min="1" :max="6" :step="1"/>
					</Parameter>
					<Parameter>
						<InputButton label="Increment" @click="ex4.seed = (ex4.seed % 6) + 1"/>
					</Parameter>
				</div>
				<div class="preview">
					<div class="aspect">
						<div class="canvas">
							<img class="dice" src="../assets/dice.svg" :style="{left: `${(ex4.seed-1) * -100}%`}">
						</div>
					</div>
				</div>
			</div>

			<h2>
				Example
				<span class="outline">#5</span>
			</h2>
			<p>Code Editor.</p>
			<div class="ui">
				<InputCodeEditor class="code" v-model="ex5.code" lang="javascript"/>
			</div>

			<h2>
				Example
				<span class="outline">#6</span>
			</h2>
			<p>Play Controls</p>
			<div class="ui no-preview">
				<div class="param" style="margin-bottom: 0.5em;">
					<Parameter label="Timecode" v-model="ex6.time">
						<InputTime
							class="param-field--1w"
							v-model="ex6.time"
							:fps="24"
							:min="ex6.min"
							:max="ex6.max"
							style="margin-right: .5em;"
						/>
						<InputButton class="left" label="«-1" @click="ex6.playing = false; ex6.time--"/>
						<InputButton
							class="center"
							@click="togglePlay"
							:icon="ex6.playing ? './assets/icon_pause.svg' : './assets/icon_play.svg'"
						/>
						<InputButton class="right" label="+1»" @click="ex6.playing = false; ex6.time++"/>
					</Parameter>
					<Parameter label="Value">
						<ParamFieldSlider
							class="input"
							:value="ex6.currentValue"
							@input="onUpdateCurrentValue"
							:min="0"
							:max="1"
						/>
					</Parameter>
				</div>
				<Timeline
					:time.sync="ex6.time"
					:min="ex6.min"
					:max="ex6.max"
					:autoScroll="ex6.playing"
					@scrubstart="ex6.playing = false"
				>
					<TimelineDraw
						:drawFunc="draw"
						style="height: calc(var(--layout-input-height) * 2)"
						ref="timelineDraw"
					/>
				</Timeline>
			</div>-->
		</div>
	</SelectionManager>
</template>

<script lang="ts">
import {Component, Vue, Watch, Inject} from 'vue-property-decorator'
import Color from '../data/Color'
import TimelineColor from '../components/TimelineColor'
import Components from '../components'
import {p, g} from '../data/Schema'

const PI_2 = Math.PI * 2

@Component({
	components: Components,
	data() {
		const time = 2
		const min = 0
		const max = 240
		const values = new Float32Array(Array(max - min + 1).fill(0.5))

		return {
			ex1: {
				radius: 25,
				scale: [1, 1],
				position: [50, 50],
				fill: new Color('hsv', [339, 64, 100]),
				stroke: new Color('hsv', [331, 83, 89]),
				strokeWidth: 3
			},
			ex1Schema: g('', {}, [
				p('radius', {ui: 'slider', min: 0, max: 50, unit: '%', prefix: 'R'}),
				p('scale', {ui: 'scale', keepProportion: false}),
				p('position', {ui: 'point', unit: '%'}),
				p('fill', {ui: 'color'}),
				p('stroke', {ui: 'color'}),
				p('strokeWidth', {ui: 'slider', min: 0, max: 10, step: 1, precision: 0})
			]),
			ex1UserSchema: g('', {}, []),
			ex2: {
				text: 'Hello World',
				rotation: 0,
				trim: [0, 50]
			},
			ex2Schema: g('', {}, [
				p('text', {ui: 'string'}),
				p('rotation', {ui: 'angle'}),
				p('trim', {ui: 'range', min: 0, max: 100, unit: '%'})
			]),
			ex2UserSchema: g('', {}, []),
			ex3: {
				image: 'Mochi',
				inverted: false,
				edge: 'Rounded'
			},
			ex3Schema: g('', {}, [
				p('image', {ui: 'dropdown', values: ['Mochi', 'Dango', 'Beko-mochi']}),
				p('inverted', {ui: 'checkbox'}),
				p('edge', {ui: 'mode', values: ['Rounded', 'Circle', 'Glow']})
			]),
			ex3UserSchema: g('', {}, []),
			ex4: {
				seed: 1
			},
			ex4Schema: g('', {}, [p('seed', {ui: 'seed'})]),
			ex4UserSchema: g('', {}, []),
			ex5: {
				code: 'console.log("Hello World")'
			},
			ex6: {
				time,
				min,
				max,
				playing: false,
				values,
				currentValue: values[time]
			}
		}
	}
})
export default class ComponentsList extends Vue {
	@Inject({from: 'Config'}) private Config!: any

	private trimText(text: string, min: number, max: number) {
		const len = text.length

		const start = Math.floor((min / 100) * len)
		const end = Math.floor((max / 100) * len)

		return text.slice(start, end)
	}

	private togglePlay() {
		const {ex6} = this.$data
		const playing = !ex6.playing
		ex6.playing = playing

		if (playing) {
			let prevTime = performance.now()
			const timelineDraw = this.$refs.timelineDraw as TimelineColor

			const update = (time: number) => {
				if (!ex6.playing) {
					ex6.currentValue = ex6.values[ex6.time]
					return
				}

				if (time - prevTime > 1000 / 24) {
					ex6.time += 1

					if (ex6.time > ex6.max) {
						ex6.time = ex6.max
						return
					}

					// ex6.currentValue = ex6.values[ex6.time]
					ex6.values[ex6.time] = ex6.currentValue
					timelineDraw.renderColors()

					prevTime = time
				}

				requestAnimationFrame(update)
			}

			requestAnimationFrame(update)
		}
	}

	@Watch('ex6.time')
	private onTimeChanged() {
		const {ex6} = this.$data

		if (!ex6.playing) {
			ex6.currentValue = ex6.values[ex6.time]
		}
	}

	private onUpdateCurrentValue(newValue: number) {
		const time = this.$data.ex6.time

		this.$data.ex6.values[time] = newValue
		this.$data.ex6.currentValue = newValue

		const timelineDraw = this.$refs.timelineDraw as TimelineColor
		timelineDraw.renderColors()
	}

	private draw(
		ctx: CanvasRenderingContext2D,
		frame: number,
		width: number,
		height: number
	) {
		const value = this.$data.ex6.values[frame]
		ctx.fillStyle = (this.Config.theme.colorActive as Color).cssColor
		ctx.fillRect(0, height * (1 - value), width, height * value)
	}
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.ui
	display flex
	align-items flex-start
	margin-bottom 4em

	&.no-preview
		display block

	.param
		flex-grow 1
		margin 1em

	.preview
		position relative
		margin 1em
		width 20%

		.aspect
			position relativ
			padding-top 100%
			width 100%

		.canvas
			position absolute
			top 0
			left 0
			overflow hidden
			width 100%
			height 100%
			background white

			&.Rounded
				border-radius 10%

			&.Circle
				border-radius 50%

			&.Glow
				box-shadow 0 0 10px 3px orange

			.dice
				position absolute
				top 0
				width 600%
				height 100%

	.code
		width 100%
		height 10em
</style>
