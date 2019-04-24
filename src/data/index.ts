// Bind
type DataBindType = 'key' | 'osc' | 'midi'
type DataBind = [DataBindType, string]

// Color
type DataColorMode =
	| 'hex'
	| 'hexa'
	| 'rgb'
	| 'rgba'
	| 'hsl'
	| 'hsla'
	| 'hsv'
	| 'hsva'
type DataColorElements = string | number[] | [string, number]
type DataColor = [DataColorMode, DataColorElements]

interface DataColorModeInfo {
	max: number[]
	label: string[]
	unit: string[]
}

const DataColorInfo = new Map<DataColorMode, DataColorModeInfo>([
	['hex', {max: [NaN], label: [''], unit: ['']}],
	['hexa', {max: [NaN, 100], label: ['', 'A'], unit: ['', '%']}],
	['rgb', {max: [255, 255, 255], label: ['R', 'G', 'B'], unit: ['', '', '']}],
	[
		'rgba',
		{
			max: [255, 255, 255, 100],
			label: ['R', 'G', 'B', 'A'],
			unit: ['', '', '', '%']
		}
	],
	[
		'hsl',
		{max: [360, 100, 100], label: ['H', 'S', 'L'], unit: ['°', '%', '%']}
	],
	[
		'hsla',
		{
			max: [360, 100, 100, 100],
			label: ['H', 'S', 'L', 'A'],
			unit: ['°', '%', '%', '%']
		}
	],
	[
		'hsv',
		{max: [360, 100, 100], label: ['H', 'S', 'V'], unit: ['°', '%', '%']}
	],
	[
		'hsva',
		{
			max: [360, 100, 100, 100],
			label: ['H', 'S', 'V', 'A'],
			unit: ['°', '%', '%', '%']
		}
	]
])

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
	DataBindType,
	DataBind,
	DataColorMode,
	DataColorElements,
	DataColor,
	DataColorModeInfo,
	DataColorInfo,
	DataTransform,
	DataTransformType,
	DataTransformValue,
	DataTransformType1DList,
	DataTransformType2DList,
	DataTransformTypeMatrixList,
	DataTransformTypeList,
	DataTransformStack
}
