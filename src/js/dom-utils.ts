import * as mezr from 'mezr'
import Point from './point'

export function getDOMCenter(el: HTMLElement) : Point {
	const {top, right, bottom, left} = mezr.rect(el)
	return new Point(
		(left + right) / 2,
		(top + bottom) / 2
	)
}