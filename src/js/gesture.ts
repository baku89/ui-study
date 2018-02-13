import * as ClickDrag  from 'clickdrag'
import { EventEmitter } from 'eventemitter3'
import * as Mousetrap from 'mousetrap'

import Point from './point'

class Gesture extends EventEmitter {

	private drag: ClickDrag
	private Multiplier: Gesture.Multiplier

	constructor(dragElement: HTMLElement, inputElement?: HTMLInputElement) {
		super()

		this.Multiplier = Gesture.Multiplier.Normal
		this.drag = ClickDrag(dragElement, {touch: true})

		let origin: Point 
		let dx, dy, ox, oy, px, py
		let justMousedown

		this.drag.on('start', (e: MouseEvent) => {

			px = e.pageX
			py = e.pageY
			origin = new Point(e.pageX, e.pageY)
			justMousedown = true	

			Mousetrap.bind('shift', () => {
				this.Multiplier = Gesture.Multiplier.Larger
			}, 'keydown')
			Mousetrap.bind('shift', () => {
				this.Multiplier = Gesture.Multiplier.Normal
			}, 'keyup')
	
			Mousetrap.bind('option', () => {
				this.Multiplier = Gesture.Multiplier.Smaller
			}, 'keydown')
			Mousetrap.bind('option', () => {
				this.Multiplier = Gesture.Multiplier.Normal
			}, 'keyup')

			window.addEventListener('touchmove', this.preventTouchScroll)
		})

		this.drag.on('move', (e: MouseEvent) => {
			if (justMousedown) {
				justMousedown = false
				this.emit('start-drag', origin)
			}

			dx = e.pageX - px
			dy = e.pageY - py

			ox = e.pageX - origin.x
			oy = e.pageY - origin.y

			px = e.pageX
			py = e.pageY

			const dragEvent: Gesture.DragEvent = {
				delta: new Point(dx, dy),
				offset: new Point(ox, oy),
				current: new Point(e.pageX, e.pageY),
				origin,
				multiplier: this.Multiplier
			}

			this.emit('drag', dragEvent)
		})

		this.drag.on('end', (e) => {
			this.emit('end-drag')

			if (justMousedown) {
				this.emit('click')
			}

			Mousetrap.unbind('shift', 'option')

			window.removeEventListener('touchmove', this.preventTouchScroll)
		})

		if (inputElement) {

			const mousetrap = new Mousetrap(inputElement)

			mousetrap.bind('up', () => this.emit('increment', 1, Gesture.Multiplier.Normal))
			mousetrap.bind('down', () => this.emit('increment', -1, Gesture.Multiplier.Normal))
	
			mousetrap.bind('shift+up', () => this.emit('increment', 1, Gesture.Multiplier.Larger))
			mousetrap.bind('shift+down', () => this.emit('increment', -1, Gesture.Multiplier.Larger))

			mousetrap.bind('option+up', () => this.emit('increment', 1, Gesture.Multiplier.Smaller))
			mousetrap.bind('option+down', () => this.emit('increment', -1, Gesture.Multiplier.Smaller))

			mousetrap.bind(['enter', 'esc'], () => this.emit('blur'))
		}	
	}

	dispose() {
		this.drag.dispose()
		Mousetrap.unbind('up', 'shift+up', 'down', 'shift+down', 'shift', 'option')
	}

	private preventTouchScroll(e) {
		e.preventDefault()
	}
}

module Gesture {
	export enum Multiplier {
		Normal = 'normal',
		Larger = 'larger',
		Smaller = 'smaller'
	}

	export interface DragEvent {
		offset: Point,
		delta: Point,
		origin: Point,
		current: Point,
		multiplier: Gesture.Multiplier

	}
}

export = Gesture