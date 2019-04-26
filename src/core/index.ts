import Color from '../data/Color'

const angleStep = 30

type UnitNumber = [string, number]

interface DataConfig {
	lang: string
	dragSpeed: 0.5
	keySlower: string
	keyFaster: string
	keySymmetry: string
	keyQuantize: string
	keyScale: string
	quantizeAngles: number[]
	theme: {[s: string]: number | string | Color | UnitNumber}
}

const DefaultConfig: DataConfig = {
	lang: 'en',
	dragSpeed: 0.5,
	keySlower: '/key/alt',
	keyFaster: '/key/shift',
	keySymmetry: '/key/s',
	keyQuantize: '/key/q',
	keyScale: '/key/alt',
	quantizeAngles: Array(360 / angleStep)
		.fill(0)
		.map((v, i) => i * angleStep),
	theme: {
		fontSize: 12,
		fontMonospace: '"Roboto Condensed", monospace, sans-serif',
		fontCode: '"Fira Code", monospace, sans-serif',
		fontNormal: '"Roboto", Helvetica, Arial, sans-serif',
		colorActive: new Color('hex', '#63acf9'),
		colorBorder: new Color('hex', '#e0e0e0'),
		colorBorderText: new Color('hex', '#bbbbbb'),
		colorControl: new Color('hex', '#bbbbbb'),
		colorControlText: new Color('hex', '#999999'),
		colorBg: new Color('hex', '#f0f0f0'),
		colorField: new Color('hex', '#f9f9f9'),
		colorText: new Color('hex', '#444444'),
		colorSeek: new Color('hex', '#ff3854'),
		colorMenuBg: new Color('hex', '#000000'),
		colorMenuText: new Color('hex', '#ffffff'),
		colorMenuField: new Color('hex', '#000000'),
		colorMenuBorder: new Color('hex', '#333333'),
		layoutParamHeight: 2.8,
		layoutParamField1w: 6,
		layoutParamFieldGapWidget: 0.5,
		layoutParamFieldGapBox: 0.3,
		layoutInputHeight: 2,
		layoutPopoverPadding: 0.5
	}
}

const SchemaConfig = {
	lang: {
		ui: 'dropdown',
		label: 'Language',
		labels: ['English', '日本語'],
		values: ['en', 'ja']
	},
	dragSpeed: {
		ui: 'number',
		unit: '/px',
		default: 0.5
	},
	quantizeAngles: {
		ui: 'string',
		toField: (v: number[]) => v.join(', '),
		toData: (s: string) => JSON.parse(`[${s}]`),
		default: '0, 45, 90, 135, 180, 225, 270, 315'
	},
	__regex: {
		'^key': {
			ui: 'bind'
		}
	},
	theme: {
		__type: 'group',
		fontSize: {
			ui: 'number',
			label: 'Font Size',
			min: 7,
			max: 20,
			step: 1,
			unit: 'px'
		},
		__regex: {
			'^color': {
				ui: 'color'
			},
			'^font': {
				ui: 'string'
			},
			'^layout': {
				ui: 'number',
				unit: 'em',
				min: 0,
				max: 20,
				precision: 1
			}
		}
	}
}

export {DataConfig, DefaultConfig, SchemaConfig}
