import Vec2 from './Vec2'
/**
 * 2x3 Matrix
 * @class Mat2d
 *
 * @description
 * A Mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

export default class Mat2d extends Array {
	/**
	 * Create a new Mat2d with the given values
	 *
	 * @param a Component A (index 0)
	 * @param b Component B (index 1)
	 * @param c Component C (index 2)
	 * @param d Component D (index 3)
	 * @param tx Component TX (index 4)
	 * @param ty Component TY (index 5)
	 * @returns A new Mat2d
	 */
	public static fromValues(
		a: number,
		b: number,
		c: number,
		d: number,
		tx: number,
		ty: number
	): Mat2d {
		const out = new Mat2d()
		out[0] = a
		out[1] = b
		out[2] = c
		out[3] = d
		out[4] = tx
		out[5] = ty
		return out
	}

	/**
	 * Creates a new identity Mat2d
	 *
	 * @returns a new 2x3 matrix
	 */
	constructor() {
		super(6)
		this[0] = 1
		this[1] = 0
		this[2] = 0
		this[3] = 1
		this[4] = 0
		this[5] = 0
		return this
	}

	/**
	 * Creates a new Mat2d initialized with values from this
	 *
	 * @returns a new 2x3 matrix
	 */
	public clone(): Mat2d {
		const out = new Mat2d()
		out[0] = this[0]
		out[1] = this[1]
		out[2] = this[2]
		out[3] = this[3]
		out[4] = this[4]
		out[5] = this[5]
		return out
	}

	/**
	 * Copy the values from one Mat2d to another
	 *
	 * @param a the source matrix
	 * @returns this
	 */
	public copyFrom(a: Mat2d): Mat2d {
		this[0] = a[0]
		this[1] = a[1]
		this[2] = a[2]
		this[3] = a[3]
		this[4] = a[4]
		this[5] = a[5]
		return this
	}

	/**
	 * Set a Mat2d to the identity matrix
	 *
	 * @returns this
	 */
	public identity(): Mat2d {
		this[0] = 1
		this[1] = 0
		this[2] = 0
		this[3] = 1
		this[4] = 0
		this[5] = 0
		return this
	}

	/**
	 * Set the components of a Mat2d to the given values
	 *
	 * @param a Component A (index 0)
	 * @param b Component B (index 1)
	 * @param c Component C (index 2)
	 * @param d Component D (index 3)
	 * @param tx Component TX (index 4)
	 * @param ty Component TY (index 5)
	 * @returns this
	 */
	public set(
		a: number,
		b: number,
		c: number,
		d: number,
		tx: number,
		ty: number
	): Mat2d {
		this[0] = a
		this[1] = b
		this[2] = c
		this[3] = d
		this[4] = tx
		this[5] = ty
		return this
	}

	/**
	 * Inverts a Mat2d
	 *
	 * @param a the source matrix
	 * @returns this
	 */
	public invert(a: Mat2d): Mat2d | null {
		const aa = a[0],
			ab = a[1],
			ac = a[2],
			ad = a[3]
		const atx = a[4],
			aty = a[5]

		let det = aa * ad - ab * ac
		if (!det) {
			return null
		}
		det = 1.0 / det

		this[0] = ad * det
		this[1] = -ab * det
		this[2] = -ac * det
		this[3] = aa * det
		this[4] = (ac * aty - ad * atx) * det
		this[5] = (ab * atx - aa * aty) * det
		return this
	}

	/**
	 * Calculates the determinant of this
	 *
	 * @returns determinant of this
	 */
	public determinant(): number {
		return this[0] * this[3] - this[1] * this[2]
	}

	/**
	 * Multiplies two Mat2d's
	 *
	 * @param b the second operand
	 * @returns this
	 */
	public multiply(b: Mat2d): Mat2d {
		const a0 = this[0],
			a1 = this[1],
			a2 = this[2],
			a3 = this[3],
			a4 = this[4],
			a5 = this[5]
		const b0 = b[0],
			b1 = b[1],
			b2 = b[2],
			b3 = b[3],
			b4 = b[4],
			b5 = b[5]
		this[0] = a0 * b0 + a2 * b1
		this[1] = a1 * b0 + a3 * b1
		this[2] = a0 * b2 + a2 * b3
		this[3] = a1 * b2 + a3 * b3
		this[4] = a0 * b4 + a2 * b5 + a4
		this[5] = a1 * b4 + a3 * b5 + a5
		return this
	}

	/**
	 * Rotates this by the given angle
	 *
	 * @param rad the angle to rotate the matrix by
	 * @returns this
	 */
	public rotate(rad: number): Mat2d {
		const a0 = this[0],
			a1 = this[1],
			a2 = this[2],
			a3 = this[3],
			a4 = this[4],
			a5 = this[5]
		const s = Math.sin(rad)
		const c = Math.cos(rad)
		this[0] = a0 * c + a2 * s
		this[1] = a1 * c + a3 * s
		this[2] = a0 * -s + a2 * c
		this[3] = a1 * -s + a3 * c
		this[4] = a4
		this[5] = a5
		return this
	}

	/**
	 * Scales this by the dimensions in the given Vec2
	 *
	 * @param v the Vec2 to scale the matrix by
	 * @returns out
	 **/
	public scale(v: Vec2): Mat2d {
		const a0 = this[0],
			a1 = this[1],
			a2 = this[2],
			a3 = this[3],
			a4 = this[4],
			a5 = this[5]
		const v0 = v.x,
			v1 = v.y
		this[0] = a0 * v0
		this[1] = a1 * v0
		this[2] = a2 * v1
		this[3] = a3 * v1
		this[4] = a4
		this[5] = a5
		return this
	}

	/**
	 * Translates this by the dimensions in the given Vec2
	 *
	 * @param {Mat2d} out the receiving matrix
	 * @param {Mat2d} a the matrix to translate
	 * @param {Vec2} v the Vec2 to translate the matrix by
	 * @returns {Mat2d} out
	 **/
	public translate(out, a, v) {
		const a0 = a[0],
			a1 = a[1],
			a2 = a[2],
			a3 = a[3],
			a4 = a[4],
			a5 = a[5]
		const v0 = v[0],
			v1 = v[1]
		out[0] = a0
		out[1] = a1
		out[2] = a2
		out[3] = a3
		out[4] = a0 * v0 + a2 * v1 + a4
		out[5] = a1 * v0 + a3 * v1 + a5
		return out
	}

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     Mat2d.identity(dest);
	 *     Mat2d.rotate(dest, dest, rad);
	 *
	 * @param {Mat2d} out Mat2d receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {Mat2d} out
	 */
	public fromRotation(out, rad) {
		const s = Math.sin(rad),
			c = Math.cos(rad)
		out[0] = c
		out[1] = s
		out[2] = -s
		out[3] = c
		out[4] = 0
		out[5] = 0
		return out
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     Mat2d.identity(dest);
	 *     Mat2d.scale(dest, dest, vec);
	 *
	 * @param {Mat2d} out Mat2d receiving operation result
	 * @param {Vec2} v Scaling vector
	 * @returns {Mat2d} out
	 */
	public fromScaling(out, v) {
		out[0] = v[0]
		out[1] = 0
		out[2] = 0
		out[3] = v[1]
		out[4] = 0
		out[5] = 0
		return out
	}

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     Mat2d.identity(dest);
	 *     Mat2d.translate(dest, dest, vec);
	 *
	 * @param {Mat2d} out Mat2d receiving operation result
	 * @param {Vec2} v Translation vector
	 * @returns {Mat2d} out
	 */
	public fromTranslation(out, v) {
		out[0] = 1
		out[1] = 0
		out[2] = 0
		out[3] = 1
		out[4] = v[0]
		out[5] = v[1]
		return out
	}

	/**
	 * Returns a string representation of a Mat2d
	 *
	 * @param {Mat2d} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	public str(a) {
		return (
			'Mat2d(' +
			a[0] +
			', ' +
			a[1] +
			', ' +
			a[2] +
			', ' +
			a[3] +
			', ' +
			a[4] +
			', ' +
			a[5] +
			')'
		)
	}

	/**
	 * Returns Frobenius norm of a Mat2d
	 *
	 * @param {Mat2d} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	public frob(a) {
		return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], 1)
	}

	/**
	 * Adds two Mat2d's
	 *
	 * @param {Mat2d} out the receiving matrix
	 * @param {Mat2d} a the first operand
	 * @param {Mat2d} b the second operand
	 * @returns {Mat2d} out
	 */
	public add(out, a, b) {
		out[0] = a[0] + b[0]
		out[1] = a[1] + b[1]
		out[2] = a[2] + b[2]
		out[3] = a[3] + b[3]
		out[4] = a[4] + b[4]
		out[5] = a[5] + b[5]
		return out
	}

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {Mat2d} out the receiving matrix
	 * @param {Mat2d} a the first operand
	 * @param {Mat2d} b the second operand
	 * @returns {Mat2d} out
	 */
	public subtract(out, a, b) {
		out[0] = a[0] - b[0]
		out[1] = a[1] - b[1]
		out[2] = a[2] - b[2]
		out[3] = a[3] - b[3]
		out[4] = a[4] - b[4]
		out[5] = a[5] - b[5]
		return out
	}

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {Mat2d} out the receiving matrix
	 * @param {Mat2d} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {Mat2d} out
	 */
	public multiplyScalar(out, a, b) {
		out[0] = a[0] * b
		out[1] = a[1] * b
		out[2] = a[2] * b
		out[3] = a[3] * b
		out[4] = a[4] * b
		out[5] = a[5] * b
		return out
	}

	/**
	 * Adds two Mat2d's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {Mat2d} out the receiving vector
	 * @param {Mat2d} a the first operand
	 * @param {Mat2d} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {Mat2d} out
	 */
	public multiplyScalarAndAdd(out, a, b, scale) {
		out[0] = a[0] + b[0] * scale
		out[1] = a[1] + b[1] * scale
		out[2] = a[2] + b[2] * scale
		out[3] = a[3] + b[3] * scale
		out[4] = a[4] + b[4] * scale
		out[5] = a[5] + b[5] * scale
		return out
	}

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {Mat2d} a The first matrix.
	 * @param {Mat2d} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	public exactEquals(a, b) {
		return (
			a[0] === b[0] &&
			a[1] === b[1] &&
			a[2] === b[2] &&
			a[3] === b[3] &&
			a[4] === b[4] &&
			a[5] === b[5]
		)
	}

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {Mat2d} a The first matrix.
	 * @param {Mat2d} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	public equals(a, b) {
		const a0 = a[0],
			a1 = a[1],
			a2 = a[2],
			a3 = a[3],
			a4 = a[4],
			a5 = a[5]
		const b0 = b[0],
			b1 = b[1],
			b2 = b[2],
			b3 = b[3],
			b4 = b[4],
			b5 = b[5]
		return (
			Math.abs(a0 - b0) <=
				glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
			Math.abs(a1 - b1) <=
				glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
			Math.abs(a2 - b2) <=
				glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
			Math.abs(a3 - b3) <=
				glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
			Math.abs(a4 - b4) <=
				glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
			Math.abs(a5 - b5) <=
				glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5))
		)
	}
}
