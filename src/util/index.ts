import colorConvert from 'color-convert'
import mouse from 'mouse-event'

import RoteryDrag from './RoteryDrag'
import keypressed from './keypressed'
import MouseDragEvent from './MouseDragEvent'

import {DataColor, DataColorMode, DataColorElements} from '../data'
import {mod, lerp, clamp} from '../math'

function getDOMCenter(el: HTMLElement): number[] {
	const {top, right, bottom, left} = el.getBoundingClientRect()
	return [(left + right) / 2, (top + bottom) / 2]
}

function setButtonUnfocusableForMouse(button: HTMLElement) {
	button.addEventListener('mousedown', (e: MouseEvent) => {
		const clicked = mouse.buttons(e)
		if (clicked === 1) {
			window.addEventListener(
				'mouseup',
				() => {
					button.blur()
				},
				{once: true}
			)
		}
	})
}

function toCSSColor(color: DataColor): string {
	const [mode, value] = color
	let cssColor: string

	if (mode === 'hex') {
		cssColor = value as string
	} else if (mode === 'hexa') {
		const [r, g, b]: number[] = colorConvert.hex.rgb(value as string)
		const a: number = value[1] as number
		cssColor = `rgba(${r}, ${g}, ${b}, ${a}%)`
	} else {
		const [v0, v1, v2, v3] = value as number[]
		if (mode === 'rgb') {
			cssColor = `rgb(${v0}, ${v1}, ${v2})`
		} else if (mode === 'rgba') {
			cssColor = `rgba(${v0}, ${v1}, ${v2}, ${v3}%)`
		} else if (mode === 'hsl') {
			cssColor = `hsl(${v0}, ${v1}%, ${v2}%)`
		} else if (mode === 'hsv') {
			const [r, g, b]: number[] = colorConvert.hsv.rgb(value as [
				number,
				number,
				number
			])
			cssColor = `rgb(${r}, ${g}, ${b})`
		} else {
			cssColor = `rgba(${v0}, ${v1}%, ${v2}%, ${v3}%)`
		}
	}
	return cssColor
}

function convertColorElements(
	from: DataColorMode,
	to: DataColorMode,
	elements: DataColorElements
): DataColorElements {
	if (from === to) {
		return elements
	} else if (from === 'hex') {
		// @ts-ignore
		return colorConvert[from][to](elements)
	} else {
		// @ts-ignore
		const newElements = colorConvert[from][to].apply(null, elements)
		if (to === 'hex') {
			return `#${newElements}`
		} else {
			return newElements
		}
	}
}

function adjustHSB(
	color: DataColor,
	hueRotate: number,
	saturate: number,
	brightness: number
): DataColor {
	const isHS = /^hs(v|l)/.test(color[0])

	// Convert to HSV if the color is neither HSV nor HSL
	let elements: number[]
	if (isHS) {
		elements = [...color[1]] as number[]
	} else {
		elements = convertColorElements(
			color[0],
			'hsv',
			color[1] as number[]
		) as number[]
	}

	// Hue-rotate
	if (hueRotate % 360 !== 0) {
		elements[0] = mod(elements[0] + hueRotate, 360)
	}

	// Saturate / Brightness (%)
	for (let [i, inc] of [saturate, brightness].entries()) {
		i += 1
		if (inc !== 0) {
			if (inc < 0) {
				elements[i] = lerp(0, elements[i], clamp(inc / 100 + 1, 0, 1))
			} else {
				elements[i] = lerp(elements[i], 100, clamp(inc / 100, 0, 1))
			}
		}
	}

	// Convert to original color mode
	if (!isHS) {
		elements = convertColorElements('hsv', color[0], elements) as number[]
	}

	return [color[0], elements]
}

export {
	getDOMCenter,
	setButtonUnfocusableForMouse,
	toCSSColor,
	convertColorElements,
	RoteryDrag,
	keypressed,
	MouseDragEvent,
	adjustHSB
}
