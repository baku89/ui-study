<template>
	<div class="page-content">
		<canvas
			class="canvas"
			ref="canvas"
			:width="artboardSize[0]"
			:height="artboardSize[1]"
			:style="{width: artboardSize[0] + 'px', height: artboardSize[1] + 'px'}"
		></canvas>
	</div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import Components from '@/components'

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

	private mounted() {
		this.ctx = (this.$refs.canvas as HTMLCanvasElement).getContext('2d')

		this.evalGraphics()
	}

	@Watch('graphics', {deep: true})
	private evalGraphics() {
		if (!this.ctx) {
			return
		}

		const ctx = this.ctx

		const funcs: Map<string, any> = new Map([
			[
				'Rect',
				(params: any) => {
					const {x, y, width, height} = params
					ctx.strokeRect(x, y, width, height)
				}
			],
			[
				'Line',
				(params: any) => {
					const {x0, y0, x1, y1} = params
					ctx.beginPath()
					ctx.moveTo(x0, y0)
					ctx.lineTo(x1, y1)
					ctx.stroke()
				}
			],
			[
				'Polygon',
				(params: any) => {
					const {paths} = params
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
				(params: any) => {
					const {x, y, r} = params
					ctx.beginPath()
					ctx.arc(x, y, r, 0, Math.PI * 2)
					ctx.stroke()
				}
			],

			// Macros
			[
				'Diamond',
				(params: any) => {
					const {x, y, size} = params
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
				(params: any) => {
					const {x, y, size, num} = params
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

		// Evaluate lisp
		ctx.fillStyle = 'white'
		ctx.fillRect(0, 0, this.artboardSize[0], this.artboardSize[1])

		const evalGraphics = (expr: any[]) => {
			return expr.forEach(item => {
				const [type, params, children] = item

				if (children) {
					evalGraphics(children)
				}

				item = funcs.get(type)(params)

				if (item instanceof Array) {
					evalGraphics(item)
				}
			})
		}
		evalGraphics(this.graphics)
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
		border 1px solid black
</style>