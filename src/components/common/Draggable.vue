<template>
	<div @mousedown.left="onMousedown" ref="root">
		<slot/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {vec2} from 'gl-matrix'
import mezr from 'mezr'
import {clamp} from '@/math'

@Component
export default class Draggable extends Vue {
	@Prop({type: Number, default: 0}) private minDragDistance!: number
	@Prop({type: String, default: 'absolute'}) private coord!:
		| 'absolute'
		| 'normalized'

	private dragStarted!: boolean
	private origin!: vec2
	private current!: vec2
	private prev!: vec2
	private delta!: vec2
	private rect!: any

	private created() {
		this.origin = vec2.create()
		this.current = vec2.create()
		this.prev = vec2.create()
		this.delta = vec2.create()
	}

	private onMousedown(e: MouseEvent) {
		this.setCoord(this.origin, e)
		vec2.copy(this.prev, this.origin)
		vec2.set(this.delta, 0, 0)
		window.addEventListener('mousemove', this.onMousemove)
		window.addEventListener('mouseup', this.onMouseup)
		const event = {
			origin: this.origin,
			current: this.origin,
			delta: this.delta,
			currentTarget: this.$refs.root,
			originalEvent: e,
			eventName: 'dragstart'
		}

		if (this.minDragDistance === 0) {
			this.dragStarted = true
			this.$emit('dragstart', event)
		} else {
			this.dragStarted = false
		}
	}

	private onMousemove(e: MouseEvent) {
		this.setCoord(this.current, e)

		// Fire dragstart event at first when dragging distance exceeds minDragDistance
		if (
			!this.dragStarted &&
			vec2.distance(this.origin, this.current) >= this.minDragDistance
		) {
			this.dragStarted = true
			const event = {
				origin: this.origin,
				current: this.current,
				delta: this.delta,
				currentTarget: this.$refs.root,
				originalEvent: e,
				eventName: 'dragstart'
			}
			this.$emit('dragstart', event)
		}

		if (this.dragStarted) {
			vec2.sub(this.delta, this.current, this.prev)

			// Fire only when delta is not zero
			if (this.delta[0] !== 0 || this.delta[1] !== 0) {
				const event = {
					origin: this.origin,
					current: this.current,
					delta: this.delta,
					currentTarget: this.$refs.root,
					originalEvent: e,
					eventName: 'drag'
				}
				this.$emit('drag', event)
			}
		}

		vec2.copy(this.prev, this.current)
	}

	private onMouseup(e: MouseEvent) {
		window.removeEventListener('mousemove', this.onMousemove)
		window.removeEventListener('mouseup', this.onMouseup)

		this.setCoord(this.current, e)
		vec2.sub(this.delta, this.current, this.prev)

		if (this.dragStarted) {
			const event = {
				origin: this.origin,
				current: this.current,
				delta: this.delta,
				currentTarget: this.$refs.root,
				originalEvent: e,
				eventName: 'dragend'
			}
			this.$emit('dragend', event)
		} else {
			this.$emit('click', e)
		}
	}

	private setCoord(coord: vec2, e: MouseEvent) {
		if (this.coord === 'normalized') {
			const root = this.$refs.root as HTMLElement
			const {left, top, width, height} = mezr.rect(root)
			const x = (e.pageX - left) / width
			const y = (e.pageY - top) / height
			vec2.set(coord, clamp(x, 0, 1), clamp(y, 0, 1))
		} else {
			vec2.set(coord, e.pageX, e.pageY)
		}
	}
}
</script>

