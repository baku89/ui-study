import {vec2} from 'gl-matrix'
import {lerp} from '@/math'

// Returns +1, -1, 0
function isTraversedAxisMinusX(
	p1: ArrayLike<number>,
	p2: ArrayLike<number>
): number {
	// Suppose a line segment from p1 to p2.
	// It'd be okay to check if it intersects to the axis -X
	// Precisely, The axis's formula is y = lim(a -> 0) a, x < 0

	const isTraversedAxisX = p1[1] * p2[1] < 0 || (p1[1] === 0 && p2[1] > 0)

	if (isTraversedAxisX) {
		// calculate X coord of intersection to the axis
		const yabs1 = Math.abs(p1[1])
		const yabs2 = Math.abs(p2[1])
		const t = yabs1 / (yabs1 + yabs2)
		const intersectionX = lerp(p1[0], p2[0], t)

		if (intersectionX < 0) {
			// Traversed
			return Math.sign(p2[1])
		}
	}

	return 0
}

export default class RoteryDrag {
	public minDistance: number = 0
	public initialAngle!: number

	private baseRotation!: number
	private lastAngle!: number
	private prev: vec2 = vec2.create()
	private current: vec2 = vec2.create()
	private center: vec2 = vec2.create()

	public start(
		initialAngle: number,
		center: number[],
		position: number[]
	): void {
		this.initialAngle = initialAngle
		this.lastAngle = initialAngle
		vec2.copy(this.center, center)
		vec2.sub(this.prev, position, center)
		this.baseRotation = Math.floor(initialAngle / 360)
	}

	public getAngle(position: number[]): number {
		vec2.sub(this.current, position, this.center)

		if (vec2.length(this.current) < this.minDistance) {
			return this.lastAngle
		}

		const traversed = isTraversedAxisMinusX(this.prev, this.current)
		this.baseRotation -= traversed

		const angle = (Math.atan2(this.current[1], this.current[0]) / Math.PI) * 180
		this.lastAngle = this.baseRotation * 360 + angle

		vec2.copy(this.prev, this.current)

		return this.lastAngle
	}

	public get radius() {
		return vec2.length(this.current)
	}
}
