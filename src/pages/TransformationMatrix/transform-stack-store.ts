import {observable, computed} from 'mobx'
import {toRadians} from '@/math'
import {mat2d} from 'gl-matrix'
import {DataTransformValue, DataTransformStack, DataTransformType} from '@/data'

export default class TransformStackStore {
	@observable public type!: DataTransformType
	@observable public value!: DataTransformValue
	@observable public active!: boolean

	constructor({type, value, active}: DataTransformStack) {
		this.type = type
		this.value = value
		this.active = active
	}

	@computed public get matrix(): mat2d {
		let type = this.type
		let value = this.value
		const out = mat2d.create()

		// normalize to 2d vector
		const isSingleDim = /(X|Y)$/.exec(type)
		if (isSingleDim) {
			type = type.substr(0, type.length - 1) as DataTransformType
			const ident = type.includes('scale') ? 1 : 0
			const newValue = [ident, ident]
			const dim = type.substr(-1) === 'X' ? 0 : 0
			newValue[dim] = value as number
			value = newValue
		} else if (type === 'scaleUniform') {
			type = 'scale'
			value = [value as number, value as number]
		}

		if (type === 'translate') {
			mat2d.fromTranslation(out, value as number[])
		} else if (type === 'rotate') {
			mat2d.fromRotation(out, toRadians(value as number))
		} else if (type === 'scale') {
			mat2d.fromScaling(out, value as number[])
		} else if (type === 'skew') {
			const tanx = Math.tan(toRadians((value as number[])[0]))
			const tany = Math.tan(toRadians((value as number[])[1]))
			mat2d.set(out, 1, tany, tanx, 1, 0, 0)
		} else if (type === 'matrix') {
			mat2d.copy(out, value as any)
		} else {
			mat2d.identity(out)
		}
		return out
	}

	@computed public get matrixInverse(): mat2d | null {
		const out = mat2d.create()
		return mat2d.invert(out, this.matrix) === null ? null : out
	}
}
