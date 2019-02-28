<template>
	<div class="page-content article">
		<h2>Example 1</h2>
		<p>Slider, Scale, Position, and Color.</p>
		<div class="example">
			<div class="param">
				<div class="column">
					<label>Radius</label>
					<ParameterSlider class="input" v-model="ex1.radius" :min="0" :max="50"/>
				</div>
				<div class="column">
					<label>Scale</label>
					<ParameterScale class="input" v-model="ex1.scale" unit="%"/>
				</div>
				<div class="column">
					<label>Position</label>
					<ParameterPoint class="input" v-model="ex1.position" :min="0" :max="100" unit="%"/>
				</div>
				<div class="column">
					<label>Color</label>
					<ParameterColor class="input" v-model="ex1.color"/>
				</div>
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
				<div class="column">
					<label>Text</label>
					<InputString class="input long" v-model="ex2.text"/>
				</div>
				<div class="column">
					<label>Angle</label>
					<ParameterAngle class="input" v-model="ex2.rotation"/>
				</div>
				<div class="column">
					<label>Trim</label>
					<ParameterRange class="input" v-model="ex2.trim" :min="0" :max="100" unit="%"/>
				</div>
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
				<div class="column">
					<label>Image</label>
					<InputDropdown
						class="input long"
						v-model="ex3.image"
						:values="['Mochi', 'Dango', 'Beko-mochi']"
					/>
				</div>
				<div class="column">
					<label>Inverted</label>
					<InputCheckbox class="input" v-model="ex3.inverted"/>
				</div>
				<div class="column">
					<label>Edge</label>
					<InputMode class="input no-grow" v-model="ex3.edge" :values="['Rounded', 'Circle', 'Grow']"/>
				</div>
			</div>
			<div class="preview">
				<div class="aspect" :style="{filter: ex3.inverted ? 'invert(1)' : ''}">
					<img :class="['canvas', ex3.edge]" :src="`./assets/${ex3.image}.jpg`">
				</div>
			</div>
		</div>

		<h2>Example 4</h2>
		<p>Random seed.</p>
		<div class="example">
			<div class="param">
				<div class="column">
					<label>Roll</label>
					<InputRandomSeed v-model="ex4.seed" :min="1" :max="6" :step="1"/>
				</div>
			</div>
			<div class="preview">
				<div class="aspect">
					<div class="canvas">
						<img class="dice" src="../assets/dice.svg" :style="{left: `${(ex4.seed-1) * -100}%`}">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

import {toCSSColor} from '@/util'
import {DataColor} from '@/data'

import Components from '@/components'

@Component({
	components: Components,
	data() {
		return {
			ex1: {
				radius: 25,
				scale: [100, 100],
				position: [50, 50],
				color: ['hsl', [332, 74, 55]]
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

	.param
		flex-grow 1
		margin 2em
		margin-right 1em

	.column
		display flex
		margin-bottom 0.8em

		&:last-child
			margin-bottom 0

		label
			padding 0 1em 0 0.2em
			width 6em
			line-height $input-height

		.input
			flex-grow 1

			&.narrow
				flex-grow 0
				width 6em

			&.long
				flex-grow 0
				width 12em

			&.no-grow
				flex-grow 0

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

			&.Grow
				box-shadow 0 0 10px 3px orange

			.dice
				position absolute
				top 0
				width 600%
				height 100%
</style>
