export default class Vec3 {
	public x: number
	public y: number
	public z: number

	constructor(x: number = 0, y?: number, z?: number) {
		if (y === undefined || z === undefined) {
			z = y = x
		}
		this.x = x
		this.y = y
		this.z = z
	}
}
