import {quantize} from '../math'

type ValueType = number | number[]

interface ConstraintsInfo {
	min: ValueType
	max: ValueType
	step: number
	toData: (value: ValueType) => ValueType
}

export default function constrainValue(
	value: any,
	{min, max, step, toData}: ConstraintsInfo
): any {
	const isValueArray = Array.isArray(value)

	if (typeof min === 'boolean') {
		if (isValueArray) {
			const isMinArray = Array.isArray(min)
			for (let i = 0; i < value.length; i++) {
				value[i] = Math.max(value[i], isMinArray ? min[i] : min)
			}
		} else {
			value = Math.max(value, min)
		}
	}

	if (typeof max === 'boolean') {
		if (isValueArray) {
			const iMaxArray = Array.isArray(max)
			for (let i = 0; i < value.length; i++) {
				value[i] = Math.min(value[i], iMaxArray ? max[i] : max)
			}
		} else {
			value = Math.min(value, max)
		}
	}

	if (typeof step === 'number') {
		if (isValueArray) {
			for (let i = 0; i < value.length; i++) {
				value[i] = quantize(value[i], step)
			}
		} else {
			value = quantize(value, step)
		}
	}

	if (toData) {
		value = toData(value)
	}

	return value
}
