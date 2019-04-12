import {Component, Vue, Prop} from 'vue-property-decorator'
import mouse from 'mouse-event'
import {vec2} from 'gl-matrix'

import {clamp} from '../../math'

@Component
export default class Drag extends Vue {
	@Prop({type: String, default: 'absolute'}) private coord!:
		| 'absolute'
		| 'normalized'
	@Prop({type: String, default: 'uniform'}) private detectDirection!:
		| 'uniform'
		| 'horizontal'
		| 'vertical'
	@Prop({type: Number, default: 0}) private minDragDistance!: number
	@Prop({type: Boolean, default: false}) private clamp!: boolean
	@Prop({type: String}) private box!: string

	private dragStarted!: boolean

	private origin!: vec2
	private current!: vec2
	private prev!: vec2
	private delta!: vec2

	private absOrigin!: vec2
	private absCurrent!: vec2
	private absPrev!: vec2

	private created() {
		this.dragStarted = false
		this.origin = vec2.create()
		this.current = vec2.create()
		this.prev = vec2.create()
		this.delta = vec2.create()

		this.absOrigin = vec2.create()
		this.absCurrent = vec2.create()
		this.absPrev = vec2.create()

		this.onMousedown = this.onMousedown.bind(this)
		this.onKeyToggle = this.onKeyToggle.bind(this)
		this.onMousemove = this.onMousemove.bind(this)
		this.onMouseup = this.onMouseup.bind(this)
	}

	private mounted() {
		this.$el.addEventListener('mousedown', this.onMousedown)
	}

	private beforeDestroy() {
		this.$el.removeEventListener('mousedown', this.onMousedown)
		this.quitDrag()
	}

	private get boxElement(): Element | null {
		return this.box ? document.querySelector(this.box) : this.$el
	}

	private onMousedown(e: Event) {
		// Only react when left button clicked
		if (mouse.buttons(e as MouseEvent) !== 1) {
			return
		}

		vec2.set(
			this.absOrigin,
			(e as MouseEvent).clientX,
			(e as MouseEvent).clientY
		)
		vec2.copy(this.absPrev, this.absOrigin)

		if (this.minDragDistance === 0) {
			// Emit immediately
			this.dragStarted = true
			this.toSpecifiedCoord(this.origin, this.absOrigin)
			vec2.copy(this.current, this.origin)
			vec2.copy(this.prev, this.origin)
			vec2.set(this.delta, 0, 0)

			const event = {
				current: this.current,
				delta: this.delta,
				preventDefault: this.quitDrag,
				originalEvent: e
			}
			this.$emit('dragstart', event)
		} else {
			// Otherwise, wait
			this.dragStarted = false
		}

		window.addEventListener('mousemove', this.onMousemove)
		window.addEventListener('mouseup', this.onMouseup)
		window.addEventListener('keydown', this.onKeyToggle)
		window.addEventListener('keyup', this.onKeyToggle)
	}

	private onKeyToggle(e: KeyboardEvent) {
		if (this.dragStarted) {
			const event = {
				current: this.current,
				delta: this.delta,
				preventDefault: this.quitDrag,
				originalEvent: e
			}

			this.$emit('drag', event)
		}
	}

	private onMousemove(e: Event) {
		vec2.set(
			this.absCurrent,
			(e as MouseEvent).clientX,
			(e as MouseEvent).clientY
		)

		// Only process when the mouse coordinate has moved more than 1px in specified direction
		let hasMoved
		if (this.detectDirection === 'uniform') {
			hasMoved = !vec2.equals(this.absCurrent, this.absPrev)
		} else {
			const detectIndex = this.detectDirection === 'horizontal' ? 0 : 1
			hasMoved = this.absCurrent[detectIndex] !== this.absPrev[detectIndex]
		}

		if (hasMoved) {
			// Detect dragstart when minDragDistance > 0
			if (!this.dragStarted) {
				const dragDistance = vec2.distance(this.absOrigin, this.absCurrent)
				if (dragDistance >= this.minDragDistance) {
					// Re-assign origin
					this.toSpecifiedCoord(this.current, this.absCurrent)
					vec2.copy(this.origin, this.current)
					vec2.copy(this.prev, this.current)

					const event = {
						current: this.current,
						delta: this.delta,
						preventDefault: this.quitDrag,
						originalEvent: e
					}

					this.dragStarted = true
					this.$emit('dragstart', event)
				}
			} else {
				// Detect drag
				this.toSpecifiedCoord(this.current, this.absCurrent)
				vec2.sub(this.delta, this.current, this.prev)

				const event = {
					current: this.current,
					delta: this.delta,
					preventDefault: this.quitDrag,
					originalEvent: e
				}

				this.$emit('drag', event)
				vec2.copy(this.prev, this.current)
			}
		}

		vec2.copy(this.absPrev, this.absCurrent)
	}

	private onMouseup(e: Event) {
		if (this.dragStarted) {
			this.$emit('dragend', {originalEvent: e})
		} else {
			this.$emit('click', {originalEvent: e})
		}
		this.quitDrag()
	}

	private quitDrag() {
		this.dragStarted = false
		window.removeEventListener('mousemove', this.onMousemove)
		window.removeEventListener('mouseup', this.onMouseup)
		window.removeEventListener('keydown', this.onKeyToggle)
		window.removeEventListener('keyup', this.onKeyToggle)
	}

	private toSpecifiedCoord(coord: vec2, absCoord: vec2) {
		const {left, top, right, bottom} = this.boxElement!.getBoundingClientRect()
		let x = absCoord[0]
		let y = absCoord[1]

		if (this.clamp) {
			x = clamp(x, left, right)
			y = clamp(y, top, bottom)
		}

		if (this.coord === 'normalized') {
			x = (x - left) / (right - left)
			y = (y - top) / (bottom - top)
		}

		vec2.set(coord, x, y)
	}

	private render() {
		const defaultSlot = this.$slots.default
		if (defaultSlot && defaultSlot[0]) {
			return defaultSlot[0]
		}
	}
}
