export default class Point {
	x: number = 0
	y: number = 0

	constructor(x?: number, y?: number) {
		if (x !== undefined) this.x = x
		if (y !== undefined) this.y = y

		return this
	}

	copy(source: Point) {
		this.x = source.x
		this.y = source.y
		return this
	}

	max(): number {
		return Math.max(this.x, this.y)
	}

	clone(): Point {
		return new Point(this.x, this.y)
	}

	add(a: Point) {
		this.x += a.x
		this.y += a.y
	}

	getDistance(target: Point) {
		return Math.sqrt(
			Math.pow(target.x - this.x, 2) +
			Math.pow(target.y - this.y, 2)
		)
	}
}