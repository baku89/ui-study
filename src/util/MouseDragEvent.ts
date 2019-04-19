import {vec2} from 'gl-matrix'

export default interface MouseDragEvent {
	current: vec2
	delta: vec2
	offset: vec2
	abort: () => void
	originalEvent: Event
}
