<template>
	<div class="page-content">
		<aside class="parameters">
			<header class="box-header">
				<h3 class="box-title">TRANSFORM</h3>
				<InputIconAction
					class="box-add"
					:items="transformItems"
					@click="state.addStack({type: $event})"
					src="./assets/icon_plus.svg"
				/>
			</header>
			<VueDraggable
				tag="ul"
				:value="state.transform"
				@input="state.setTransform({transform: $event})"
				:options="{handle: '.handle'}"
			>
				<Param
					v-for="(stack, index) in state.transform"
					:key="index"
					:icon="toIcon(stack)"
					@remove="state.removeStack({index})"
					@icon-clicked="state.toggleActive({index})"
				>
					<template slot="label">{{toLabel(stack.type)}}</template>
					<component
						:is="toComponentName(stack.type)"
						:value="toFieldValue(stack)"
						:unit="stack.type.includes('scale') ? '%' : (stack.type === 'skew' ? '°' : null)"
						@input="state.setValue({index, value: toDataValue(stack.type, $event)})"
					/>
				</Param>
			</VueDraggable>
		</aside>
		<main class="preview">
			<div class="preview__frame">
				<svg class="preview__canvas" ref="canvas" viewBox="0 0 20 20" :style="{'--px': pixelSize}">
					<defs>
						<symbol id="corner-circle" overflow="visible">
							<circle class="bbox-corner" :r="pixelSize * 4"></circle>
						</symbol>
						<symbol id="corner-square" overflow="visible">
							<rect
								class="bbox-corner"
								:x="-pixelSize * 3"
								:y="-pixelSize * 3"
								:width="pixelSize * 6"
								:height="pixelSize * 6"
							></rect>
						</symbol>
						<symbol id="rotate-handle" overflow="visible">
							<rect class="bbox-rotate-handle" :x="-0.3" :y="-0.3" :width="0.6" :height="0.6"></rect>
						</symbol>
					</defs>
					<g transform="translate(10 10)">
						<text class="axis-label x" x="9.7" y=".5" :font-size="pixelSize * 15 + 'px'">+X</text>
						<text class="axis-label y" x=".5" y="9.7" :font-size="pixelSize * 15 + 'px'">+Y</text>
						<line class="axis x" x1="-10" y1="0" x2="10" y2="0" marker-start="url(#round-corner)"></line>
						<line class="axis y" x1="0" y1="-10" x2="0" y2="10"></line>
						<Drag v-if="state.bboxRotateActive" @drag="onDragRotate">
							<g>
								<use href="#rotate-handle" :transform="transformBBoxCorner(0, 0)"></use>
								<use href="#rotate-handle" :transform="transformBBoxCorner(1, 0)"></use>
								<use href="#rotate-handle" :transform="transformBBoxCorner(1, 1)"></use>
								<use href="#rotate-handle" :transform="transformBBoxCorner(0, 1)"></use>
							</g>
						</Drag>
						<g :transform="state.svgTransform">
							<Drag coord="normalized" @drag="onDragTranslate" box=".preview__canvas">
								<image class="image" xlink:href="../../assets/Mochi.jpg" x="0" y="0" width="1" height="1"></image>
							</Drag>
						</g>
						<g :transform="state.svgTransformActiveScale">
							<Drag
								v-if="state.bboxScaleActive"
								coord="normalized"
								@dragstart="onDragstartScale"
								@drag="onDragScale"
								box=".preview__canvas"
							>
								<rect class="bbox-scale-handle" x="0" y="0" width="1" height="1"></rect>
							</Drag>
							<rect class="bbox-edge" x="0" y="0" width="1" height="1"></rect>
						</g>
						<Drag
							coord="normalized"
							@dragstart="onDragstartScale"
							@drag="onDragScale"
							box=".preview__canvas"
						>
							<g>
								<use
									:href="this.state.bboxRotateActive ? '#corner-circle' : '#corner-square'"
									:transform="transformBBoxCorner(0, 0)"
								></use>
								<use
									:href="this.state.bboxRotateActive ? '#corner-circle' : '#corner-square'"
									:transform="transformBBoxCorner(1, 0)"
								></use>
								<use
									:href="this.state.bboxRotateActive ? '#corner-circle' : '#corner-square'"
									:transform="transformBBoxCorner(1, 1)"
								></use>
								<use
									:href="this.state.bboxRotateActive ? '#corner-circle' : '#corner-square'"
									:transform="transformBBoxCorner(0, 1)"
								></use>
							</g>
						</Drag>
					</g>
				</svg>
			</div>
		</main>
	</div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import changeCase, {isUpperCase} from 'change-case'
import {vec2, mat2d} from 'gl-matrix'
import {Observer} from 'mobx-vue'
// @ts-ignore
import VueDraggable from 'vuedraggable'

import {
	DataTransform,
	DataTransformType,
	DataTransformType1DList,
	DataTransformTypeList,
	DataTransformType2DList,
	DataTransformStack,
	DataTransformValue
} from '../../data'
import {convertColorElements} from '../../util'
import {toRadians, ratio} from '../../math'

import Components from '../../components'
import Param from './Param.vue'
import Drag from '../../components/common/Drag'
import TransformStore from './transform-store'

@Observer
@Component({
	components: {...Components, VueDraggable, Param, Drag}
})
export default class TransformationMatrix extends Vue {
	private state = new TransformStore([
		{type: 'translate', value: [2, 1], active: true},
		{type: 'scale', value: [2, 2], active: true},
		{type: 'rotate', value: 90, active: true}
	])

	private transformItems: any = [
		{
			value: 'translate',
			label: 'Translate',
			type: 'compact',
			submenu: [
				{value: 'translateX', label: 'Translate X', shortLabel: 'X'},
				{value: 'translateY', label: 'Translate Y', shortLabel: 'Y'}
			]
		},
		{value: 'rotate', label: 'Rotate'},
		{
			value: 'scale',
			label: 'Scale',
			type: 'compact',
			submenu: [
				{value: 'scaleX', label: 'Scale X', shortLabel: 'X'},
				{value: 'scaleY', label: 'Scale Y', shortLabel: 'Y'},
				{value: 'scaleUniform', label: 'Scale Uniform', shortLabel: 'Uniform'}
			]
		},
		{
			value: 'skew',
			label: 'Skew',
			type: 'compact',
			submenu: [
				{value: 'skewX', label: 'Skew X', shortLabel: 'X'},
				{value: 'skewY', label: 'Skew Y', shortLabel: 'Y'}
			]
		},
		{value: 'matrix', label: 'Matrix'}
	]

	private pixelSize: number = 0

	private initialMatrix: mat2d = mat2d.create()
	private initialMatrixInverse: mat2d = mat2d.create()
	private initialScaleValue: vec2 = vec2.create()

	private draggedPart!:
		| 'top-left'
		| 'top-right'
		| 'bottom-right'
		| 'bottom-left'
		| 'top'
		| 'right'
		| 'bottom'
		| 'left'
	private isSymmetrical: boolean = false

	// Lifecycle events
	private mounted() {
		this.onResize = this.onResize.bind(this)
		window.addEventListener('resize', this.onResize)
		this.onResize()
	}

	private beforeDestroy() {
		window.removeEventListener('resize', this.onResize)
	}

	// Events
	private onResize() {
		this.pixelSize = 20 / (this.$refs.canvas as Element).clientWidth
	}

	// bbox: translate
	private onDragTranslate({delta}: {delta: vec2}) {
		const gDelta = vec2.scale(vec2.create(), delta, 20)
		const destination = mat2d.fromTranslation(mat2d.create(), gDelta)
		mat2d.mul(destination, destination, this.state.matrix)
		this.state.calcBackTransform({destination, type: 'translate'})
	}

	// bbox: scale
	private onDragstartScale({
		current,
		preventDefault,
		originalEvent
	}: {
		current: vec2
		preventDefault: () => void
		originalEvent: MouseEvent
	}) {
		if (this.state.activeScaleMatrixInverse === null) {
			preventDefault()
		} else {
			// Store the initial matrix and its inverse
			mat2d.copy(this.initialMatrix, this.state.matrix)
			mat2d.copy(this.initialMatrixInverse, this.state.activeScaleMatrixInverse)
			vec2.copy(
				this.initialScaleValue,
				// @ts-ignore
				this.state.transform[this.state.activeScaleIndex].value
			)

			// Determine which part of bounding box was dragged
			{
				// Calc current position on the local coordinate
				const position = vec2.create()
				vec2.scaleAndAdd(position, [-10, -10], current, 20)
				vec2.transformMat2d(position, position, this.initialMatrixInverse)

				const x = position[0] - 0.5
				const y = position[1] - 0.5

				//  /:::
				// /::::
				const isLowerRight = x + y > 0
				// \::::
				//  \:::
				const isUpperRight = x - y > 0

				//  /
				// /
				const isOnTopRightDiagonal = Math.abs(x + y) < this.pixelSize * 3
				// \
				//  \
				const isOnBottomRightDiagonal = Math.abs(x - y) < this.pixelSize * 3

				if (isOnTopRightDiagonal) {
					this.draggedPart = isUpperRight ? 'top-right' : 'bottom-left'
				} else if (isOnBottomRightDiagonal) {
					this.draggedPart = isLowerRight ? 'bottom-right' : 'top-left'
				} else if (isLowerRight) {
					this.draggedPart = isUpperRight ? 'right' : 'bottom'
				} else {
					this.draggedPart = isUpperRight ? 'top' : 'left'
				}
			}

			this.isSymmetrical = originalEvent.altKey
		}
	}

	private onDragScale({
		current,
		originalEvent
	}: {
		current: vec2
		originalEvent: MouseEvent
	}) {
		// Calc current position on the local coordinate
		const position = vec2.scaleAndAdd(vec2.create(), [-10, -10], current, 20)
		vec2.transformMat2d(position, position, this.initialMatrixInverse)

		// Set the pivot and corner to scale
		const pivot = vec2.create()
		const corner = vec2.create()
		const isSymmetrical = originalEvent.altKey
		let constraint: 'horizontal' | 'vertical' | null = null

		switch (this.draggedPart) {
			case 'top-left':
				vec2.set(pivot, 1, 1)
				vec2.set(corner, 0, 0)
				break
			case 'top-right':
				vec2.set(pivot, 0, 1)
				vec2.set(corner, 1, 0)
				break
			case 'bottom-right':
				vec2.set(pivot, 0, 0)
				vec2.set(corner, 1, 1)
				break
			case 'bottom-left':
				vec2.set(pivot, 1, 0)
				vec2.set(corner, 0, 1)
				break
			case 'top':
				vec2.set(pivot, 1, 1)
				vec2.set(corner, 0, 0)
				constraint = 'vertical'
				break
			case 'right':
				vec2.set(pivot, 0, 0)
				vec2.set(corner, 1, 1)
				constraint = 'horizontal'
				break
			case 'bottom':
				vec2.set(pivot, 0, 0)
				vec2.set(corner, 1, 1)
				constraint = 'vertical'
				break
			case 'left':
				vec2.set(pivot, 1, 1)
				vec2.set(corner, 0, 0)
				constraint = 'horizontal'
				break
		}

		// Calculate the scale and translate
		if (isSymmetrical) {
			vec2.set(pivot, 0.5, 0.5)
		}
		const scale = vec2.fromValues(
			ratio(position[0], pivot[0], corner[0]),
			ratio(position[1], pivot[1], corner[1])
		)

		const translate = vec2.fromValues(
			corner[0] < pivot[0]
				? position[0]
				: isSymmetrical
				? corner[0] - position[0]
				: 0,
			corner[1] < pivot[1]
				? position[1]
				: isSymmetrical
				? corner[1] - position[1]
				: 0
		)

		if (constraint === 'horizontal') {
			scale[1] = 1
			translate[1] = 0
		} else if (constraint === 'vertical') {
			scale[0] = 1
			translate[0] = 0
		}

		// Calc back the transform matrices
		const destination = mat2d.create()

		console.log(scale.join(', '))

		vec2.mul(scale, scale, this.initialScaleValue)

		this.state.setScale(scale)

		// First, calc back only the scale
		// mat2d.fromScaling(destination, scale)
		// mat2d.mul(destination, this.initialMatrix, destination)
		// this.state.calcBackTransform({destination, type: 'scale'})

		// Then, do it again on the translate
		// mat2d.fromTranslation(destination, translate)
		// mat2d.scale(destination, destination, scale)
		// mat2d.mul(destination, this.initialMatrix, destination)
		// this.state.calcBackTransform({destination, type: 'translate'})
	}

	private onDragRotate({delta}: {delta: vec2}) {
		const angle = -delta[0] / 100

		const destination = mat2d.create()
		mat2d.translate(destination, destination, [0.5, 0.5])
		mat2d.rotate(destination, destination, angle)
		mat2d.translate(destination, destination, [-0.5, -0.5])
		mat2d.mul(destination, this.state.matrix, destination)

		this.state.calcBackTransform({destination, type: 'rotate'})
		this.state.calcBackTransform({destination, type: 'translate'})
	}

	private toIcon(stack: DataTransformStack) {
		if (stack.active) {
			if (stack.type === 'translate') {
				return 'translate'
			} else if (stack.type === 'scale') {
				return 'scale'
			} else if (stack.type === 'rotate') {
				return 'rotate'
			} else {
				return true
			}
		} else {
			return null
		}
	}

	private toComponentName(type: DataTransformType): string {
		switch (type) {
			case 'translateX':
			case 'translateY':
			case 'scaleX':
			case 'scaleY':
				return 'ParamFieldNumber'
			case 'translate':
				return 'ParamFieldPoint'
			case 'scale':
				return 'ParamFieldScale'
			case 'skew':
				return 'ParamFieldPoint'
			case 'rotate':
			case 'skewX':
			case 'skewY':
				return 'ParamFieldAngle'
			case 'matrix':
				return 'ParamFieldAffine'
			default:
				return 'ParamFieldNumber'
		}
	}

	private toLabel(type: DataTransformType): string {
		return changeCase.titleCase(type) as string
	}

	private toFieldValue(stack: DataTransformStack) {
		if (stack.type.includes('scale')) {
			return stack.value instanceof Array
				? stack.value.map((v: number) => v * 100)
				: stack.value * 100
		} else if (stack.type.includes('translate')) {
			return stack.value instanceof Array
				? stack.value.map((v: number) => v * 10)
				: stack.value * 10
		} else {
			return stack.value
		}
	}

	private toDataValue(type: DataTransformType, value: DataTransformValue) {
		if (type.includes('scale')) {
			return value instanceof Array ? value.map(v => v / 100) : value / 100
		} else if (type.includes('translate')) {
			return value instanceof Array ? value.map(v => v / 10) : value / 10
		} else {
			return value
		}
	}

	private transformBBoxCorner(x: number, y: number): string {
		if (this.state.activeScaleMatrix !== null) {
			const m = mat2d.fromTranslation(mat2d.create(), [x, y])
			mat2d.mul(m, this.state.activeScaleMatrix, m)

			const axisX = vec2.fromValues(m[0], m[1])
			const axisY = vec2.fromValues(m[2], m[3])

			vec2.normalize(axisX, axisX)
			vec2.normalize(axisY, axisY)

			if (vec2.dot(axisX, axisY) !== 0) {
				const angle = vec2.angle(axisX, axisY)
				const offset = (Math.PI / 2 - angle) / 2
				const origin = vec2.create()

				vec2.rotate(axisX, axisX, origin, -offset)
				vec2.rotate(axisY, axisY, origin, offset)

				// console.log('angle', angle)
			}

			m[0] = axisX[0]
			m[1] = axisX[1]
			m[2] = axisY[0]
			m[3] = axisY[1]

			return `matrix(${m.join(' ')})`
		} else {
			return ''
		}
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

.box-header
	display flex

.box-title
	flex-grow 1
	margin-bottom 1.2em
	height 2em
	color #838383
	letter-spacing 0.2em
	font-size 1.2em
	line-height @height

.parameters
	margin-right 1em
	width 30em

.preview
	position relative
	flex-grow 1

	&__frame
		position relative
		padding-top 100%
		height 0
		border 1px solid var(--color-border)
		background white

	&__canvas
		position absolute
		top 0
		left 0
		width 100%
		height 100%

		.axis
			vector-effect non-scaling-stroke

			&.x
				stroke #ff0000

			&.y
				stroke #00ff00

		.axis-label
			text-anchor middle
			dominant-baseline central

			&.x
				fill #ff0000

			&.y
				fill #00ff00

		.image
			cursor move

		.bbox-edge
			pointer-events none
			stroke-width 1px
			vector-effect non-scaling-stroke
			stroke var(--color-active)
			fill none

		.bbox-scale-handle
			cursor ew-resize
			pointer-events stroke
			stroke-width 10px
			vector-effect non-scaling-stroke
			stroke transparent
			fill none

		.bbox-rotate-handle
			cursor crosshair
			fill transparent

		.bbox-corner
			cursor ew-resize
			stroke-width 1px
			vector-effect non-scaling-stroke
			stroke var(--color-active)
			fill white
</style>
