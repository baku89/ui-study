import mezr from 'mezr'
import colorConvert from 'color-convert'
import RoteryDrag from './RoteryDrag'
import {DataColor, DataColorMode, DataColorElements} from '../data'

function getDOMCenter(el: HTMLElement): number[] {
	const {top, right, bottom, left} = el.getBoundingClientRect()
	return [(left + right) / 2, (top + bottom) / 2]
}

function toCSSColor([mode, value]: DataColor): string {
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

export {getDOMCenter, toCSSColor, convertColorElements, RoteryDrag}
