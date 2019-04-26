import colorConvert from 'color-convert'
import {mod, lerp, clamp} from '../math'

export type ColorMode = 'rgb' | 'hsv' | 'hsl' | 'hex'
export type ColorElements = string | number[]

interface ColorModeInfoValue {
	max: number[]
	label: string[]
	unit: string[]
}

export const ColorModeInfo: {[s: string]: ColorModeInfoValue} = {
	hex: {max: [NaN], label: [''], unit: ['']},
	rgb: {max: [255, 255, 255], label: ['R', 'G', 'B'], unit: ['', '', '']},
	hsl: {max: [360, 100, 100], label: ['H', 'S', 'L'], unit: ['°', '%', '%']},
	hsv: {max: [360, 100, 100], label: ['H', 'S', 'V'], unit: ['°', '%', '%']}
}

export default class Color {
	public static cssColor(color: Color): string {
		return color.cssColor
	}

	public static convertMode(color: Color, mode: ColorMode) {
		const newColor = color.clone()
		return newColor.convertMode(mode)
	}

	public static adjustHSB(
		color: Color,
		hueRotate: number,
		saturate: number,
		brightness: number
	) {
		const newColor = color.clone()
		return newColor.adjustHSB(hueRotate, saturate, brightness)
	}

	public mode!: ColorMode
	public elements!: ColorElements

	constructor(mode: ColorMode, elements: ColorElements) {
		this.mode = mode
		this.elements = elements
	}

	public clone(): Color {
		const elements = Array.isArray(this.elements)
			? [...this.elements]
			: this.elements
		return new Color(this.mode, elements)
	}

	public get cssColor(): string {
		console.log('cssColor')
		const {mode, elements} = this
		let cssColor: string

		if (mode === 'hex') {
			cssColor = elements as string
		} else {
			const [v0, v1, v2] = elements
			if (mode === 'rgb') {
				cssColor = `rgb(${v0}, ${v1}, ${v2})`
			} else if (mode === 'hsl') {
				cssColor = `hsl(${v0}, ${v1}%, ${v2}%)`
			} else {
				const [r, g, b]: number[] = colorConvert[mode].rgb(elements as [
					number,
					number,
					number
				])
				cssColor = `rgb(${r}, ${g}, ${b})`
			}
		}
		return cssColor
	}

	public convertMode(mode: ColorMode): Color {
		const {mode: originalMode, elements} = this

		if (originalMode === 'hex') {
			// @ts-ignore
			this.elements = colorConvert[originalMode][mode](elements)
		} else {
			// @ts-ignore
			this.elements = colorConvert[originalMode][mode].apply(null, elements)
			if (mode === 'hex') {
				this.elements = `#${this.elements}`
			}
		}

		this.mode = mode

		return this
	}

	public adjustHSB(hueRotate: number, saturate: number, brightness: number) {
		const {mode} = this
		const isHSB = mode === 'hsv' || mode === 'hsl'

		// Convert to HSV if the color is neither HSV nor HSL
		if (!isHSB) {
			this.convertMode('hsv')
		}

		const hsb = this.elements as number[]

		// Hue-rotate
		if (hueRotate % 360 !== 0) {
			hsb[0] = mod(hsb[0] + hueRotate, 360)
		}

		// Saturate / Brightness (%)
		for (let [i, inc] of [saturate, brightness].entries()) {
			i += 1
			if (inc !== 0) {
				if (inc < 0) {
					hsb[i] = lerp(0, hsb[i], clamp(inc / 100 + 1, 0, 1))
				} else {
					hsb[i] = lerp(hsb[i], 100, clamp(inc / 100, 0, 1))
				}
			}
		}

		// Convert to original color mode
		if (!isHSB) {
			this.convertMode(mode)
		}

		return this
	}
}
