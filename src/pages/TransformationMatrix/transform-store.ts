import {Vue} from 'vue-property-decorator'
import {observable, action, computed} from 'mobx'
import {mat2d, vec2} from 'gl-matrix'
import math from 'mathjs'

import TransformStackStore from './transform-stack-store'

import {toDegrees} from '../../math'
import {
	DataTransformValue,
	DataTransformType,
	DataTransform,
	DataTransformType1DList,
	DataTransformType2DList
} from '../../data'

export default class TransformStore {
	// Observable
	@observable
	public transform!: TransformStackStore[]

	constructor(transform: DataTransform) {
		this.transform = transform.map(stack => new TransformStackStore(stack))
	}

	// Computed
	@computed
	public get svgTransform(): string {
		return `matrix(${this.matrix.join(' ')})`
	}

	@computed public get matrix(): mat2d {
		const out = mat2d.create()
		for (const stack of this.transform) {
			mat2d.mul(out, out, stack.matrix)
		}
		return out
	}

	@computed public get activeScaleMatrix(): mat2d | null {
		if (this.bboxRotateActive) {
			const out = mat2d.create()
			for (let i = 0; i <= this.activeScaleIndex; i++) {
				mat2d.mul(out, out, this.transform[i].matrix)
			}
			return out
		} else {
			return null
		}
	}

	@computed public get activeScaleMatrixInverse(): mat2d | null {
		if (this.activeScaleMatrix !== null) {
			return mat2d.invert(mat2d.create(), this.activeScaleMatrix)
		} else {
			return null
		}
	}

	@computed public get svgTransformActiveScale(): string {
		if (this.activeScaleMatrix !== null) {
			return `matrix(${this.activeScaleMatrix.join(' ')})`
		} else {
			return ''
		}
	}

	@computed public get activeScaleIndex(): number {
		const index = this.transform.findIndex(s => s.type === 'scale' && s.active)
		return index
	}

	@computed public get bboxTranslateActive(): boolean {
		return this.transform.some(s => s.type === 'translate' && s.active)
	}

	@computed public get bboxScaleActive(): boolean {
		return (
			this.transform.some(s => s.type === 'scale' && s.active) &&
			this.bboxTranslateActive
		)
	}

	@computed public get bboxRotateActive(): boolean {
		return (
			this.transform.some(s => s.type === 'rotate' && s.active) &&
			this.bboxTranslateActive
		)
	}

	@computed public get matrixInverse(): mat2d | null {
		return mat2d.invert(mat2d.create(), this.matrix)
	}

	@action.bound
	public setValue({index, value}: {index: number; value: DataTransformValue}) {
		this.transform[index].value = value
	}

	@action.bound
	public setTransform(payload: {transform: DataTransform}) {
		this.transform = payload.transform.map(
			stack => new TransformStackStore(stack)
		)
	}

	@action.bound
	public removeStack({index}: {index: number}) {
		this.transform.splice(index, 1)
	}

	@action.bound
	public addStack({type}: {type: DataTransformType}) {
		let value

		const ident = type.includes('scale') ? 1 : 0

		if (DataTransformType1DList.includes(type)) {
			value = ident
		} else if (DataTransformType2DList.includes(type)) {
			value = [ident, ident]
		} else {
			value = [1, 0, 0, 1, 0, 0]
		}

		const shouldActivate = /^(translate|scale|rotate)$/.test(type)
			? !this.transform.some(s => s.type === type && s.active)
			: false

		const stack = new TransformStackStore({type, value, active: shouldActivate})

		this.transform.push(stack)
	}

	@action.bound
	public toggleActive({index}: {index: number}) {
		const stack = this.transform[index]

		if (stack.active) {
			stack.active = false
		} else {
			const targetType = stack.type

			if (/^(translate|rotate|scale)$/.test(targetType)) {
				// Switch off all other activated stacks in advance
				this.transform.forEach(s => {
					if (s.type === targetType && s.active) {
						s.active = false
					}
				})
				// Then activate it
				stack.active = true
			}
		}
	}

	@action.bound
	public calcBackTransform({
		destination,
		type
	}: {
		destination: mat2d
		type: 'translate' | 'scale' | 'rotate'
	}) {
		// Retrieve the index of varying matrix
		const index = this.transform.findIndex(s => !!s.active && s.type === type)
		if (index === -1) {
			console.error('No proper active stack')
			return
		}
		const stack = this.transform[index]

		// Check if there's an invalid inverted matrix
		for (const s of this.transform) {
			if (s !== stack && s.matrixInverse === null) {
				console.error('Cannot calculate transformation')
				return
			}
		}

		// Calculate the varying matrix
		// Tk = T(k-1)·...·T(0)·Ml·T(n-1)·...·T(k+1)
		const vMatrix = mat2d.create()

		// T(k-1)·...·T(0)
		for (let i = index - 1; i >= 0; i--) {
			mat2d.mul(vMatrix, vMatrix, this.transform[i].matrixInverse as mat2d)
		}

		// Ml
		mat2d.mul(vMatrix, vMatrix, destination)

		// T(n-1)·...·T(k+1)
		for (let i = this.transform.length - 1; i >= index + 1; i--) {
			mat2d.mul(vMatrix, vMatrix, this.transform[i].matrixInverse as mat2d)
		}

		// Decompose the matrix into the value of transform stack
		const [a, b, c, d, tx, ty] = vMatrix

		if (stack.type === 'translate') {
			// For translate, just extract the elements of tx, ty
			this.transform[index].value = [tx, ty]
		} else if (stack.type === 'scale') {
			// As for scale, do QR decomposition
			// [a c]
			// [b d]
			const {Q, R} = math.qr([[a, c], [b, d]])

			// console.log(Q, R)
			// @ts-ignore
			// toString(Q, 'Q')
			// // @ts-ignore
			// toString(R, 'R')

			// function toString(mat: number[][], name: string) {
			// 	console.log(
			// 		mat.map(arr => arr.map(fixed).join(' ')).join('\n') + ` ${name}`
			// 	)
			// }

			function fixed(n: number) {
				const sign = n > 0 ? '+' : n === 0 ? ' ' : ''
				return `${sign}${n.toFixed(2)}`
			}

			// @ts-ignore
			const x = R[0][0]
			// @ts-ignore
			const y = R[1][1]

			this.transform[index].value = [x, y]
		} else if (stack.type === 'rotate') {
			// Same as scale, but extract the value from the matrix Q

			const {Q} = math.qr([[a, c], [b, d]])

			// @ts-ignore
			const xx = Q[0][0]
			// @ts-ignore
			const xy = Q[1][0]

			const angle = toDegrees(Math.atan2(xy, xx))
			this.transform[index].value = angle
		}
	}

	// @action.bound
	public setScale(scale: vec2) {
		if (this.activeScaleIndex === -1) {
			console.error('No proper active stack')
			return
		}
		// @ts-ignore
		this.transform[this.activeScaleIndex].value = scale
	}
}
