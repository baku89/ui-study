// Color
type DataColorMode = 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsl'
type DataColorElements = string | number[] | [string, number]
type DataColor = [DataColorMode, DataColorElements]

const DataColorInfo = {
	maxValue: {
		hex: [NaN],
		hexa: [NaN, 100],
		rgb: [255, 255, 255],
		rgba: [255, 255, 255, 100],
		hsl: [360, 100, 100],
		hsla: [360, 100, 100, 100]
	},
	label: {
		hex: [''],
		hexa: ['', 'A'],
		rgb: ['R', 'G', 'B'],
		rgba: ['R', 'G', 'B', 'A'],
		hsl: ['H', 'S', 'L'],
		hsla: ['H', 'S', 'L', 'A']
	},
	unit: {
		hex: [''],
		hexa: ['', '%'],
		rgb: [''],
		rgba: ['', '', '', '%'],
		hsl: ['°', '%', '%'],
		hsla: ['°', '%', '%', '%']
	}
}

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
	DataColorMode,
	DataColorElements,
	DataColor,
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
