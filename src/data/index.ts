import Color from './Color'

// Bind
type DataBindType = 'key' | 'osc' | 'midi'
type DataBind = [DataBindType, string]

// Transform
type DataTransformType1D =
	| 'translateX'
	| 'translateY'
	| 'scaleX'
	| 'scaleY'
	| 'scaleUniform'
	| 'rotate'
	| 'skewX'
	| 'skewY'

type DataTransformType2D = 'translate' | 'scale' | 'skew'

type DataTransformTypeMatrix = 'matrix'

type DataTransformType =
	| DataTransformType1D
	| DataTransformType2D
	| DataTransformTypeMatrix

type DataTransformValue = number | number[]

const DataTransformType1DList = [
	'translateX',
	'translateY',
	'scaleX',
	'scaleY',
	'scaleUniform',
	'rotate',
	'skewX',
	'skewY'
]

const DataTransformType2DList = ['translate', 'scale', 'skew']

const DataTransformTypeMatrixList = ['matrix']

const DataTransformTypeList = [
	...DataTransformType1DList,
	...DataTransformType2DList,
	...DataTransformTypeMatrixList
]

interface DataTransformStack {
	type: DataTransformType
	value: DataTransformValue
	active: boolean
}

type DataTransform = DataTransformStack[]

export {
	Color,
	DataBindType,
	DataBind,
	DataTransform,
	DataTransformType,
	DataTransformValue,
	DataTransformType1DList,
	DataTransformType2DList,
	DataTransformTypeMatrixList,
	DataTransformTypeList,
	DataTransformStack
}
