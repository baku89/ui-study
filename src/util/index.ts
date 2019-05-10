import mouse from 'mouse-event'

import constrainValue from './constrain-value'
import deserialize from './deserialize'
import forceNotify from './force-notify'
import RoteryDrag from './RoteryDrag'
import MouseDragEvent from './MouseDragEvent'
import splitToParentAndKey from './split-to-parent-and-key'

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
	constrainValue,
	deserialize,
	forceNotify,
	getDOMCenter,
	setButtonUnfocusableForMouse,
	RoteryDrag,
	MouseDragEvent,
	splitToParentAndKey
}
