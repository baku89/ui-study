export enum ParamType {
	Float = 'float',
	Point = 'point',
	Angle = 'angle',
	Slider = 'slider',
	Group = 'group',
	Scale = 'scale'
}

export interface Param {
	type: ParamType,
	name: string,
	value: any,
	label?: string,
	options?: object,
	unit?: string
}