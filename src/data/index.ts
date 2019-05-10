import Color from './Color'

// Transform
export type DataTransformType1D =
	| 'translateX'
	| 'translateY'
	| 'scaleX'
	| 'scaleY'
	| 'scaleUniform'
	| 'rotate'
	| 'skewX'
	| 'skewY'

export type DataTransformType2D = 'translate' | 'scale' | 'skew'

export type DataTransformTypeMatrix = 'matrix'

export type DataTransformType =
	| DataTransformType1D
	| DataTransformType2D
	| DataTransformTypeMatrix

export type DataTransformValue = number | number[]

export const DataTransformType1DList = [
	'translateX',
	'translateY',
	'scaleX',
	'scaleY',
	'scaleUniform',
	'rotate',
	'skewX',
	'skewY'
]

export const DataTransformType2DList = ['translate', 'scale', 'skew']

export const DataTransformTypeMatrixList = ['matrix']

export const DataTransformTypeList = [
	...DataTransformType1DList,
	...DataTransformType2DList,
	...DataTransformTypeMatrixList
]

export interface DataTransformStack {
	type: DataTransformType
	value: DataTransformValue
	active: boolean
}

export type DataTransform = DataTransformStack[]

export interface Store {
	[name: string]: number | string | number[] | Color | Store
}

export {Color}
