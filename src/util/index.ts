import mouse from 'mouse-event'

import deserialize from './deserialize'
import RoteryDrag from './RoteryDrag'
import MouseDragEvent from './MouseDragEvent'

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
export {
	getDOMCenter,
	setButtonUnfocusableForMouse,
	RoteryDrag,
	MouseDragEvent,
	deserialize
}
