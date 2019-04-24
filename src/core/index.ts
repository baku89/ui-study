import Bind from '../data/Bind'

import {DataColor} from '../data'

const angleStep = 30

type UnitNumber = [string, number]

interface DataConfig {
	lang: string
	dragSpeed: 0.5
	keySlower: Bind
	keyFaster: Bind
	keySymmetry: Bind
	keyQuantize: Bind
	keyScale: Bind
	quantizeAngles: number[]
	theme: {[s: string]: number | string | DataColor | UnitNumber}
}

const DefaultConfig: DataConfig = {
	lang: 'en',
	dragSpeed: 0.5,
	keySlower: new Bind('key', 'alt'),
	keyFaster: new Bind('key', 'shift'),
	keySymmetry: new Bind('key', 's'),
	keyQuantize: new Bind('key', 'q'),
	keyScale: new Bind('key', 'alt'),
	quantizeAngles: Array(360 / angleStep)
		.fill(0)
		.map((v, i) => i * angleStep),
	theme: {
		fontSize: 12,
		fontMonospace: '"Roboto Condensed", monospace, sans-serif',
		fontCode: '"Fira Code", monospace, sans-serif',
		fontNormal: '"Roboto", Helvetica, Arial, sans-serif',
		colorActive: ['hex', '#63acf9'],
		colorBorder: ['hex', '#e0e0e0'],
		colorBorderText: ['hex', '#bbbbbb'],
		colorControl: ['hex', '#bbbbbb'],
		colorControlText: ['hex', '#999999'],
		colorBg: ['hex', '#f0f0f0'],
		colorField: ['hex', '#f9f9f9'],
		colorText: ['hex', '#444444'],
		colorSeek: ['hex', '#ff3854'],
		colorMenuBg: ['hex', '#000000'],
		colorMenuText: ['hex', '#ffffff'],
		colorMenuField: ['hex', '#000000'],
		colorMenuBorder: ['hex', '#333333'],
		layoutParamHeight: 2.8,
		layoutParamField1w: 6,
		layoutParamFieldGapWidget: 0.5,
		layoutParamFieldGapBox: 0.3,
		layoutInputHeight: 2,
		layoutPopoverPadding: 0.5
	}
}

const DefinitionConfig = {
	lang: {
		type: 'dropdown',
		label: 'Language',
		labels: ['English', '日本語'],
		values: ['en', 'ja']
	},
	dragSpeed: {
		type: 'number',
		unit: '/px',
		default: 0.5
	},
	quantizeAngles: {
		type: 'string',
		toField: (v: number[]) => v.join(', '),
		toData: (s: string) => JSON.parse(`[${s}]`),
		default: '0, 45, 90, 135, 180, 225, 270, 315'
	},
	_regex: {
		'^key': {
			type: 'bind'
		}
	},
	'group:theme': {
		fontSize: {
			type: 'number',
			label: 'Font Size',
			min: 7,
			max: 20,
			step: 1,
			unit: 'px'
		},
		_regex: {
			'^color': {
				type: 'color'
			},
			'^font': {
				type: 'string'
			},
			'^layout': {
				type: 'number',
				unit: 'em',
				min: 0,
				max: 20,
				step: 0.1
			}
		},
		_expand: 'flat'
	}
}

export {DataConfig, DefaultConfig, DefinitionConfig}
