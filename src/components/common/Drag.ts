import {Component, Vue, Prop} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'

import {clamp} from '../../math'

@Component
export default class Drag extends Vue {
	@Prop({type: String, default: 'absolute'}) private coord!:
		| 'absolute'
		| 'normalized'
	@Prop({type: Number, default: 0}) private minDragDistance!: number
	@Prop({type: Boolean, default: false}) private clamp!: boolean
	@Prop({type: String}) private box!: string

	private dragStarted!: boolean
	private origin!: vec2
	private current!: vec2
	private prev!: vec2
	private delta!: vec2

	private created() {
		this.dragStarted = false
		this.origin = vec2.create()
		this.current = vec2.create()
		this.prev = vec2.create()
		this.delta = vec2.create()

		this.onMousedown = this.onMousedown.bind(this)
		this.onMousemove = this.onMousemove.bind(this)
		this.onMouseup = this.onMouseup.bind(this)
	}

	private mounted() {
		this.$el.addEventListener('mousedown', this.onMousedown)
	}

	private beforeDestroy() {
		this.quitDrag()
	}

	private get boxElement(): Element | null {
		return this.box ? document.querySelector(this.box) : this.$el
	}

	private onMousedown(e: Event) {
		this.setCoord(this.origin, e as MouseEvent)
		vec2.copy(this.current, this.origin)
		vec2.copy(this.prev, this.current)
		vec2.set(this.delta, 0, 0)

		window.addEventListener('mousemove', this.onMousemove)
		window.addEventListener('mouseup', this.onMouseup)
		window.addEventListener('keydown', this.onKeyToggle)
		window.addEventListener('keyup', this.onKeyToggle)

		// Emit immediately
		if (this.minDragDistance === 0) {
			this.dragStarted = true
			const event = {
				current: this.current,
				delta: this.delta,
				preventDefault: this.quitDrag,
				originalEvent: e
			}
			this.$emit('dragstart', event)
		} else {
			this.dragStarted = false
		}
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
		this.setCoord(this.current, e as MouseEvent)

		const hasMoved = !vec2.equals(this.current, this.prev)

		if (hasMoved) {
			vec2.sub(this.delta, this.current, this.prev)

			const event = {
				current: this.current,
				delta: this.delta,
				preventDefault: this.quitDrag,
				originalEvent: e
			}

			if (
				!this.dragStarted &&
				vec2.distance(this.origin, this.current) >= this.minDragDistance
			) {
				this.dragStarted = true
				this.$emit('dragstart', event)
			}

			if (this.dragStarted) {
				this.$emit('drag', event)
				vec2.copy(this.prev, this.current)
			}
		}
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

	private setCoord(coord: vec2, e: MouseEvent) {
		const {left, top, right, bottom} = this.boxElement!.getBoundingClientRect()
		let x = e.pageX
		let y = e.pageY

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
