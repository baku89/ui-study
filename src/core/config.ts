import Color from '../data/Color'
import {p, g, SchemaGroup} from '../data/Schema'

export const ConfigDefault = {
	lang: 'en',
	dragSpeed: 0.5,
	keySlower: '/key/alt',
	keyFaster: '/key/shift',
	keySymmetry: '/key/s',
	keyQuantize: '/key/q',
	keyScale: '/key/alt',
	quantizeAngles: [0, 45, 90, 135, 180, 225, 270, 315],
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

export const ConfigSchema: SchemaGroup = g('config', {}, [
	p('lang', {
		ui: 'dropdown',
		label: 'Language',
		labels: ['English', '日本語'],
		values: ['en', 'ja']
	}),
	p('dragSpeed', {
		ui: 'number',
		unit: '/px'
	}),
	p('keySlower', {ui: 'bind'}),
	p('keyFaster', {ui: 'bind'}),
	p('keySymmetry', {ui: 'bind'}),
	p('keyQuantize', {ui: 'bind'}),
	p('keyScale', {ui: 'bind'}),
	p('quantizeAngles', {
		ui: 'string',
		toField: (v: number[]) => v.join(', '),
		toData: (v: string) => JSON.parse(`[${v}]`)
	}),
	g('theme', {label: 'Theme'}, [
		p('fontSize', {
			ui: 'number',
			label: 'Font Size',
			min: 7,
			max: 20,
			step: 1,
			unit: 'px'
		}),
		p('fontMonospace', {
			ui: 'string'
		}),
		p('fontCode', {
			ui: 'string'
		}),
		p('fontNormal', {
			ui: 'string'
		}),
		p('colorActive', {ui: 'color'}),
		p('colorBorder', {ui: 'color'}),
		p('colorBorderText', {ui: 'color'}),
		p('colorControl', {ui: 'color'}),
		p('colorControlText', {ui: 'color'}),
		p('colorBg', {ui: 'color'}),
		p('colorField', {ui: 'color'}),
		p('colorText', {ui: 'color'}),
		p('colorSeek', {ui: 'color'}),
		p('colorMenuBg', {ui: 'color'}),
		p('colorMenuText', {ui: 'color'}),
		p('colorMenuField', {ui: 'color'}),
		p('colorMenuBorder', {ui: 'color'}),
		p('layoutParamHeight', {
			ui: 'number',
			unit: 'em',
			min: 0,
			max: 20,
			precision: 1
		}),
		p('layoutParamField1w', {
			ui: 'number',
			unit: 'em',
			min: 0,
			max: 20,
			precision: 1
		}),
		p('layoutParamFieldGapWidget', {
			ui: 'number',
			unit: 'em',
			min: 0,
			max: 20,
			precision: 1
		}),
		p('layoutParamFieldGapBox', {
			ui: 'number',
			unit: 'em',
			min: 0,
			max: 20,
			precision: 1
		}),
		p('layoutInputHeight', {
			ui: 'number',
			unit: 'em',
			min: 0,
			max: 20,
			precision: 1
		}),
		p('layoutPopoverPadding', {
			ui: 'number',
			unit: 'em',
			min: 0,
			max: 20,
			precision: 1
		})
	])
])
