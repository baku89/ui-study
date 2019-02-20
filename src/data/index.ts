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

export {DataColorMode, DataColorElements, DataColor, DataColorInfo}
