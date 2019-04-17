<template>
	<div class="page-content article">
		<h2>Example 1</h2>
		<p>Slider, Scale, Position, and Color.</p>
		<div class="example">
			<div class="param">
				<Parameter label="Radius">
					<ParamFieldSlider class="input" v-model="ex1.radius" :min="0" :max="50"/>
				</Parameter>
				<Parameter label="Scale">
					<ParamFieldScale class="input" v-model="ex1.scale" unit="%"/>
				</Parameter>
				<Parameter label="Position">
					<ParamFieldPoint class="input" v-model="ex1.position" :min="0" :max="100" unit="%"/>
				</Parameter>
				<Parameter label="Color">
					<ParamFieldColor class="input" v-model="ex1.color"/>
				</Parameter>
			</div>
			<div class="preview">
				<div class="aspect">
					<svg class="canvas" viewBox="0 0 100 100">
						<circle
							:fill="toCSSColor(ex1.color)"
							cx="0"
							cy="0"
							:r="ex1.radius"
							:transform="`translate(${ex1.position[0]}, ${ex1.position[1]}) scale(${ex1.scale[0] / 100}, ${ex1.scale[1] / 100})`"
						></circle>
					</svg>
				</div>
			</div>
		</div>

		<h2>Example 2</h2>
		<p>String, Angle, and Range (min/max).</p>
		<div class="example">
			<div class="param">
				<Parameter label="Text">
					<InputString class="input long" v-model="ex2.text"/>
				</Parameter>
				<Parameter label="Angle">
					<ParamFieldAngle class="input" v-model="ex2.rotation"/>
				</Parameter>
				<Parameter label="Trim">
					<ParamFieldRange class="input" v-model="ex2.trim" :min="0" :max="100" unit="%"/>
				</Parameter>
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

		<h2>Example 3</h2>
		<p>Dropdown, Checkbox, and Select.</p>
		<div class="example">
			<div class="param">
				<Parameter label="Image">
					<InputDropdown
						class="input long"
						v-model="ex3.image"
						:values="['Mochi', 'Dango', 'Beko-mochi']"
					/>
				</Parameter>
				<Parameter label="Inverted">
					<InputCheckbox class="input" v-model="ex3.inverted"/>
				</Parameter>
				<Parameter label="Edge">
					<InputMode class="input no-grow" v-model="ex3.edge" :values="['Rounded', 'Circle', 'Glow']"/>
				</Parameter>
			</div>
			<div class="preview">
				<div class="aspect" :style="{filter: ex3.inverted ? 'invert(1)' : ''}">
					<img :class="['canvas', ex3.edge]" :src="`./assets/${ex3.image}.jpg`">
				</div>
			</div>
		</div>

		<h2>Example 4</h2>
		<p>Random seed, Button.</p>
		<div class="example">
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

		<h2>Example 5</h2>
		<p>Code Editor.</p>
		<div class="example">
			<InputCodeEditor class="code" v-model="ex5.code" lang="javascript"/>
		</div>

		<h2>Example 6</h2>
		<p>Play Controls</p>
		<div class="example no-preview">
			<div class="param" style="margin-bottom: 0.5em;">
				<Parameter label="Timecode">
					<InputTime
						class="param-field--1w"
						v-model="ex6.time"
						:fps="24"
						:min="ex6.min"
						:max="ex6.max"
						style="margin-right: .5em;"
					/>
					<InputButton class="center" label="«-1" @click="ex6.playing = false; ex6.time--"/>
					<InputButton
						class="center"
						@click="togglePlay"
						:icon="ex6.playing ? './assets/icon_pause.svg' : './assets/icon_play.svg'"
					/>
					<InputButton class="center" label="+1»" @click="ex6.playing = false; ex6.time++"/>
				</Parameter>
				<Parameter label="Value">
					<ParamFieldSlider
						class="input"
						:value="ex6.currentValue"
						@input="onUpdateCurrentValue"
						:min="0"
						:max="255"
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
				<template v-slot="{displayRange}">
					<TimelineColor :value="ex6.colors" :displayRange="displayRange" ref="timelineColor"/>
				</template>
			</Timeline>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'

import {toCSSColor} from '../util'
import {DataColor} from '../data'

import raf from 'raf'
import TimelineColor from '../components/TimelineColor.vue'

import Components from '../components'

@Component({
	components: Components,
	data() {
		const time = 2
		const min = 0
		const max = 60000
		const colors = new Uint8ClampedArray(
			Array((max - min + 1) * 4)
				.fill(0)
				.map((v, i) => (i % 4 === 3 ? 255 : 0))
		)

		return {
			ex1: {
				radius: 25,
				scale: [100, 100],
				position: [50, 50],
				color: ['hsv', [332, 74, 80]]
			},
			ex2: {
				text: 'Hello World',
				rotation: 0,
				trim: [0, 50]
			},
			ex3: {
				image: 'Mochi',
				inverted: false,
				edge: 'Rounded'
			},
			ex4: {
				seed: 1
			},
			ex5: {
				code: 'console.log("Hello World")'
			},
			ex6: {
				time,
				min,
				max,
				playing: false,
				colors,
				currentValue: colors[time]
			}
		}
	},
	methods: {toCSSColor}
})
export default class ComponentsList extends Vue {
	private trimText(text: string, min: number, max: number) {
		const len = text.length

		const start = Math.floor((min / 100) * len)
		const end = Math.floor((max / 100) * len)

		return text.slice(start, end)
	}

	private togglePlay() {
		const playing = !this.$data.ex6.playing
		this.$data.ex6.playing = playing

		if (playing) {
			let prevTime = performance.now()

			const update = (time: number) => {
				if (!this.$data.ex6.playing) {
					return
				}

				if (time - prevTime > 1000 / 24) {
					this.$data.ex6.time += 1

					if (this.$data.ex6.time > this.$data.ex6.max) {
						this.$data.ex6.time = this.$data.ex6.max
						return
					}

					this.$data.ex6.currentValue = this.$data.ex6.colors[
						this.$data.ex6.time
					]
					prevTime = time
				}

				raf(update)
			}

			raf(update)
		}
	}

	@Watch('ex6.time')
	private onTimeChanged() {
		this.$data.ex6.currentValue = this.$data.ex6.colors[this.$data.ex6.time * 4]
	}

	private onUpdateCurrentValue(newValue: number) {
		const time = this.$data.ex6.time

		this.$data.ex6.colors[time * 4] = newValue
		this.$data.ex6.colors[time * 4 + 1] = newValue
		this.$data.ex6.colors[time * 4 + 2] = newValue
		this.$data.ex6.currentValue = newValue

		const timelineColor = this.$refs.timelineColor as TimelineColor
		timelineColor.renderColors()
	}
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.page-content
	padding 2rem
	width 100%
	height 100%
	user-select none

.example
	display flex
	align-items center
	margin-bottom 4em
	background var(--color-bg)
	font-size 1rem

	&.no-preview
		display block

	.param
		flex-grow 1
		margin 2em 1em 2em 2em

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
