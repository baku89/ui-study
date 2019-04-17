<template>
	<div class="page-content">
		<canvas
			class="canvas"
			ref="canvas"
			:width="artboardSize[0]"
			:height="artboardSize[1]"
			:style="{width: artboardSize[0] + 'px', height: artboardSize[1] + 'px'}"
		></canvas>
		<InputCodeEditor
			class="code"
			:value="graphicsJson"
			@input="onGraphicsJsonChanged"
			lang="javascript"
		/>
	</div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import JSON5 from 'json5'

import Components from '../../components'

type DrawFunc = (ctx: CanvasRenderingContext2D, params: object) => any

const funcs: Map<string, DrawFunc> = new Map([
	[
		'Rect',
		(ctx: CanvasRenderingContext2D, {x, y, width, height}: any) => {
			ctx.strokeRect(x, y, width, height)
		}
	],
	[
		'Line',
		(ctx: CanvasRenderingContext2D, {x0, y0, x1, y1}: any) => {
			ctx.beginPath()
			ctx.moveTo(x0, y0)
			ctx.lineTo(x1, y1)
			ctx.stroke()
		}
	],
	[
		'Polygon',
		(ctx: CanvasRenderingContext2D, {paths}: any) => {
			ctx.beginPath()
			ctx.moveTo(paths[0], paths[1])

			for (let i = 2; i < paths.length; i += 2) {
				ctx.lineTo(paths[i], paths[i + 1])
			}

			ctx.closePath()
			ctx.stroke()
		}
	],
	[
		'Circle',
		(ctx: CanvasRenderingContext2D, {x, y, r}: any) => {
			ctx.beginPath()
			ctx.arc(x, y, r, 0, Math.PI * 2)
			ctx.stroke()
		}
	],

	// Macros
	[
		'Diamond',
		(ctx: CanvasRenderingContext2D, {x, y, size}: any) => {
			const half = size / 2
			return [
				[
					'Polygon',
					{
						paths: [x, y - half, x + half, y, x, y + half, x - half, y]
					}
				]
			]
		}
	],
	[
		'MultiDiamond',
		(ctx: CanvasRenderingContext2D, {x, y, size, num}: any) => {
			return Array(num)
				.fill(null)
				.map((item, i) => {
					return [
						'Diamond',
						{
							x,
							y,
							size: (size / num) * (i + 1)
						}
					]
				})
		}
	]
])

@Component({
	components: Components
})
export default class GraphicsOnLisp extends Vue {
	private artboardSize = [200, 200]

	private graphics = [
		[
			'Rect',
			{
				x: 20,
				y: 20,
				width: 40,
				height: 40
			},
			[
				[
					'Rect',
					{
						x: 30,
						y: 40,
						width: 10,
						height: 30
					}
				],
				['Diamond', {x: 40, y: 40, size: 30}]
			]
		],
		[
			'Line',
			{
				x0: 0,
				y0: 100,
				x1: 200,
				y1: 200
			}
		],
		[
			'MultiDiamond',
			{
				x: 100,
				y: 100,
				size: 50,
				num: 4
			}
		],
		[
			'Circle',
			{
				x: 100,
				y: 20,
				r: 50
			}
		]
	]

	private ctx!: CanvasRenderingContext2D | null

	private get graphicsJson(): string {
		return JSON5.stringify(this.graphics)
	}

	private mounted() {
		const canvas = this.$refs.canvas as HTMLCanvasElement

		canvas.width = this.artboardSize[0]
		canvas.height = this.artboardSize[1]

		this.ctx = canvas.getContext('2d')

		this.evalGraphics()
	}

	@Watch('graphics', {deep: true})
	private evalGraphics() {
		if (!this.ctx) {
			return
		}

		const ctx = this.ctx

		// Evaluate lisp
		ctx.fillStyle = 'white'
		ctx.fillRect(0, 0, this.artboardSize[0], this.artboardSize[1])

		const evalGraphics = (expr: any[]) => {
			return expr.forEach(item => {
				const [type, params, children] = item

				if (children) {
					evalGraphics(children)
				}

				const draw = funcs.get(type)

				if (draw) {
					item = draw(ctx, params)

					if (item instanceof Array) {
						evalGraphics(item)
					}
				}
			})
		}
		evalGraphics(this.graphics)
	}

	private onGraphicsJsonChanged(json: string) {
		let graphics

		try {
			graphics = JSON5.parse(json)
		} catch (e) {
			return
		}

		this.graphics = graphics
	}
}
</script>

<style lang="stylus" scoped>
.page-content
	display flex
	padding 2rem
	width 100%
	height 100%
	background var(--color-bg)
	user-select none

	.canvas
		border 1px solid var(--color-border)

	.code
		flex-grow 1
</style>