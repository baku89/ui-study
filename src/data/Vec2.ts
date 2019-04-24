import {EPSILON} from './common'
import Mat2d from './Mat2d'
import Mat2 from './Mat2'
import Mat3 from './Mat3'
import Mat4 from './Mat4'
import Vec3 from './Vec3'

export default class Vec2 {
	public static add(a: Vec2, b: Vec2): Vec2 {
		const out = a.clone()
		return out.add(b)
	}

	public static subtract(a: Vec2, b: Vec2): Vec2 {
		const out = a.clone()
		return out.subtract(b)
	}

	public static divide(a: Vec2, b: Vec2): Vec2 {
		const out = a.clone()
		return out.divide(b)
	}

	public static scale(a: Vec2, b: number): Vec2 {
		const out = a.clone()
		return out.scale(b)
	}

	public static distance(a: Vec2, b: Vec2): number {
		const x = b.x - a.x,
			y = b.y - a.y
		return Math.hypot(x)
	}

	public static squaredDistance(a: Vec2, b: Vec2): number {
		const x = b.x - a.x,
			y = b.y - a.y
		return x * x + y * y
	}

	public static random(scale: number = 1) {
		const out = new Vec2()
		return out.random(scale)
	}

	public x: number
	public y: number

	constructor(x: number = 0, y?: number) {
		if (y === undefined) {
			y = x
		}
		this.x = x
		this.y = y
	}

	public clone(): Vec2 {
		return new Vec2(this.x, this.y)
	}

	public set(x: number, y: number) {
		this.x = x
		this.y = y
	}

	public add(b: Vec2): Vec2 {
		this.x += b.x
		this.y += b.y
		return this
	}

	public subtract(b: Vec2): Vec2 {
		this.x -= b.x
		this.y -= b.y
		return this
	}

	public multiply(b: Vec2): Vec2 {
		this.x *= b.x
		this.y *= b.y
		return this
	}

	public divide(b: Vec2): Vec2 {
		this.x /= b.x
		this.y /= b.y
		return this
	}

	public scale(b: number): Vec2 {
		this.x *= b
		this.y *= b
		return this
	}

	public vlength(): number {
		return Math.hypot(this.x, this.y)
	}

	public squaredLength(): number {
		const x = this.x,
			y = this.y
		return x * x + y * y
	}

	public negate(): Vec2 {
		this.x *= -1
		this.y *= -1
		return this
	}

	public inverse(): Vec2 {
		this.x = 1 / this.x
		this.y = 1 / this.x
		return this
	}

	public normalize(): Vec2 {
		const x = this.x,
			y = this.y
		let len = x * x + y * y
		if (len > 0) {
			len = 1 / Math.sqrt(len)
		}
		this.x = this.x * len
		this.y = this.y * len
		return this
	}

	/**
	 * Calculates the dot product of two vec2's
	 *
	 * @param {vec2} b the second operand
	 * @returns dot product of a and b
	 */
	public dot(b: Vec2): number {
		return this.x * b.x + this.y * b.y
	}

	/**
	 * Computes the cross product of two vec2's
	 * Note that the cross product must by definition produce a 3D vector
	 *
	 * @param {vec2} b the second operand
	 * @returns {vec3} out
	 */
	public cross(b: Vec2): Vec3 {
		const out = new Vec3()
		out.z = this.x * b.y - this.y * b.x
		return out
	}

	/**
	 * Performs a linear interpolation between two Vec2's
	 *
	 * @param b the second operand
	 * @param t interpolation amount, in the range [0-1], between the two inputs
	 * @returns this
	 */
	public lerp(b: Vec2, t: number): Vec2 {
		const x = this.x,
			y = this.y
		this.x = x + t * (b.x - x)
		this.y = y + t * (b.y - y)
		return this
	}

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns this
	 */
	public random(scale: number = 1): Vec2 {
		const r = Math.random() * 2.0 * Math.PI
		this.x = Math.cos(r) * scale
		this.y = Math.sin(r) * scale
		return this
	}

	/**
	 * Transforms the Vec2 with a Mat2
	 *
	 * @param m matrix to transform with
	 * @returns this
	 */
	public transformMat2(m: Mat2): Vec2 {
		const x = this.x,
			y = this.y
		this.x = m[0] * x + m[2] * y
		this.y = m[1] * x + m[3] * y
		return this
	}

	/**
	 * Transforms the Vec2 with a Mat2d
	 *
	 * @param m matrix to transform with
	 * @returns this
	 */
	public transformMat2d(m: Mat2d): Vec2 {
		const x = this.x,
			y = this.y
		this.x = m[0] * x + m[2] * y + m[4]
		this.y = m[1] * x + m[3] * y + m[5]
		return this
	}

	/**
	 * Transforms the Vec2 with a Mat3
	 * 3rd vector component is implicitly '1'
	 *
	 * @param m matrix to transform with
	 * @returns this
	 */
	public transformMat3(m: Mat3): Vec2 {
		const x = this.x,
			y = this.y
		this.x = m[0] * x + m[3] * y + m[6]
		this.y = m[1] * x + m[4] * y + m[7]
		return this
	}

	/**
	 * Transforms the Vec2 with a mat4
	 * 3rd vector component is implicitly '0'
	 * 4th vector component is implicitly '1'
	 *
	 * @param  m matrix to transform with
	 * @returns this
	 */
	public transformMat4(m: Mat4): Vec2 {
		const x = this.x
		const y = this.y
		this.x = m[0] * x + m[4] * y + m[12]
		this.y = m[1] * x + m[5] * y + m[13]
		return this
	}

	/**
	 * Rotate this
	 * @param b The origin of the rotation
	 * @param rad The angle of rotation
	 * @returns this
	 */
	public rotate(b: Vec2, rad: number) {
		// Translate point to the origin
		const x = this.x - b.x,
			y = this.y - b.y,
			sin = Math.sin(rad),
			cos = Math.cos(rad)

		// perform rotation and translate to correct position
		this.x = x * cos - y * sin + b.x
		this.y = x * sin + y * cos + b.y

		return this
	}

	/**
	 * Get the angle between two 2D vectors
	 * @param b The second operand
	 * @returns The angle in rad
	 */
	public angle(b: Vec2): number {
		const x1 = this.x,
			y1 = this.y,
			x2 = b.x,
			y2 = b.y

		let len1 = x1 * x1 + y1 * y1
		if (len1 > 0) {
			// TODO: evaluate use of glm_invsqrt here?
			len1 = 1 / Math.sqrt(len1)
		}

		let len2 = x2 * x2 + y2 * y2
		if (len2 > 0) {
			// TODO: evaluate use of glm_invsqrt here?
			len2 = 1 / Math.sqrt(len2)
		}

		const cosine = (x1 * x2 + y1 * y2) * len1 * len2

		if (cosine > 1.0) {
			return 0
		} else if (cosine < -1.0) {
			return Math.PI
		} else {
			return Math.acos(cosine)
		}
	}

	/**
	 * Set the components of a vec2 to zero
	 *
	 * @returns this
	 */
	public zero() {
		this.x = 0.0
		this.y = 0.0
		return this
	}

	/**
	 * Returns a string representation of a vector
	 *
	 * @returns string representation of the vector
	 */
	public toString() {
		return 'Vec2(' + this.x + ', ' + this.y + ')'
	}

	/**
	 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
	 *
	 * @param b The second vector.
	 * @returns True if the vectors are equal, false otherwise.
	 */
	public exactEquals(b: Vec2): boolean {
		return this.x === b.x && this.y === b.y
	}

	/**
	 * Returns whether or not the vectors have approximately the same elements in the same position.
	 *
	 * @param b The second vector.
	 * @returns True if the vectors are equal, false otherwise.
	 */
	public equals(b: Vec2): boolean {
		const a0 = this.x,
			a1 = this.y
		const b0 = b.x,
			b1 = b.y
		return (
			Math.abs(a0 - b0) <=
				EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
			Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1))
		)
	}
}
