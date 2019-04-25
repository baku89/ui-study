import {Component, Vue, Prop, Inject} from 'vue-property-decorator'
import mouse from 'mouse-event'
import {vec2} from 'gl-matrix'

import {clamp} from '../../math'
import {MouseDragEvent} from '../../util'
import {DataConfig, DefaultConfig} from '../../core'
import BindManager, {BindEvent} from '../../core/BindManager'

@Component
export default class Drag extends Vue {
	@Prop({type: String, default: 'pixel'}) private measure!:
		| 'pixel'
		| 'normalized'
	@Prop({type: String, default: 'uniform'}) private detectDirection!:
		| 'uniform'
		| 'horizontal'
		| 'vertical'
	@Prop({type: Number, default: 0}) private minDragDistance!: number
	@Prop({type: Boolean, default: false}) private clamp!: boolean
	@Prop(String) private box!: string

	@Inject({from: 'Config', default: DefaultConfig})
	private readonly Config!: DataConfig

	private dragStarted!: boolean

	private origin!: vec2
	private current!: vec2
	private prev!: vec2
	private delta!: vec2
	private offset!: vec2

	private absOrigin!: vec2
	private absCurrent!: vec2
	private absPrev!: vec2

	private created() {
		this.dragStarted = false
		this.origin = vec2.create()
		this.current = vec2.create()
		this.prev = vec2.create()
		this.delta = vec2.create()
		this.offset = vec2.create()

		this.absOrigin = vec2.create()
		this.absCurrent = vec2.create()
		this.absPrev = vec2.create()

		this.onMousedown = this.onMousedown.bind(this)
		this.onBindToggle = this.onBindToggle.bind(this)
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

		this.setAbsCoordByMouseEvent(this.absOrigin, e as MouseEvent)
		vec2.copy(this.absPrev, this.absOrigin)

		if (this.minDragDistance === 0) {
			// Emit immediately
			this.dragStarted = true
			this.toSpecifiedCoord(this.origin, this.absOrigin)
			vec2.copy(this.current, this.origin)
			vec2.set(this.delta, 0, 0)
			vec2.set(this.offset, 0, 0)

			const event: MouseDragEvent = {
				current: this.current,
				delta: this.delta,
				offset: this.offset,
				abort: this.quitDrag,
				originalEvent: e
			}
			BindManager.on('press', this.onBindToggle)
			BindManager.on('release', this.onBindToggle)
			this.$emit('dragstart', event)
			vec2.copy(this.prev, this.current)
		} else {
			// Otherwise, wait
			this.dragStarted = false
		}

		window.addEventListener('mousemove', this.onMousemove)
		window.addEventListener('mouseup', this.onMouseup)
	}

	private onBindToggle(e: BindEvent) {
		const {address} = e
		const {keyFaster, keySlower, keySymmetry} = this.Config

		if ([keyFaster, keySlower, keySymmetry].includes(address)) {
			vec2.set(this.delta, 0, 0)
			const event: MouseDragEvent = {
				current: this.current,
				delta: this.delta,
				offset: this.offset,
				abort: this.quitDrag,
				originalEvent: e
			}

			this.$emit('drag', event)
		}
	}

	private onMousemove(e: Event) {
		this.setAbsCoordByMouseEvent(this.absCurrent, e as MouseEvent)

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
					this.dragStarted = true
					// Re-assign origin and emit
					this.toSpecifiedCoord(this.origin, this.absCurrent)
					vec2.copy(this.current, this.origin)
					vec2.set(this.delta, 0, 0)
					vec2.set(this.offset, 0, 0)

					const event: MouseDragEvent = {
						current: this.current,
						delta: this.delta,
						offset: this.offset,
						abort: this.quitDrag,
						originalEvent: e
					}

					BindManager.on('press', this.onBindToggle)
					BindManager.on('release', this.onBindToggle)
					this.$emit('dragstart', event)
					vec2.copy(this.prev, this.origin)
				}
			} else {
				// Detect drag and emit
				this.toSpecifiedCoord(this.current, this.absCurrent)
				vec2.sub(this.delta, this.current, this.prev)
				vec2.sub(this.offset, this.current, this.origin)

				const event: MouseDragEvent = {
					current: this.current,
					delta: this.delta,
					offset: this.offset,
					abort: this.quitDrag,
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
		BindManager.off('press', this.onBindToggle)
		BindManager.off('release', this.onBindToggle)
	}

	private setAbsCoordByMouseEvent(coord: vec2, e: MouseEvent) {
		let x = e.clientX
		let y = e.clientY

		if (this.clamp) {
			const {
				left,
				top,
				right,
				bottom
			} = this.boxElement!.getBoundingClientRect()
			x = clamp(x, left, right)
			y = clamp(y, top, bottom)
		}

		vec2.set(coord, x, y)
	}

	private toSpecifiedCoord(coord: vec2, absCoord: vec2) {
		const {left, top, right, bottom} = this.boxElement!.getBoundingClientRect()
		let x = absCoord[0]
		let y = absCoord[1]

		// Omit clamping since absCoord has already clamped in setAbsCoordByMouseEvent() if necessary
		if (this.measure === 'normalized') {
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
