function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t
}

function clamp(value: number, min: number, max: number) {
	return min < max
		? value < min
			? min
			: value > max
			? max
			: value
		: value < max
		? max
		: value > min
		? min
		: value
}

function mod(a: number, b: number): number {
	return ((a % b) + b) % b
}

function ratio(
	value: number,
	bottom: number,
	top: number,
	clamped: boolean = false
) {
	const t = (value - bottom) / (top - bottom)
	return clamped ? clamp(t, 0, 1) : t
}

const numberReg = /[+-]?([0-9]*[.])?[0-9]+/

function parseNumber(str: string): number {
	// if (numberReg.test(str)) {
	// 	return parseFloat(str)
	// } else {
	// 	return NaN
	// }
	return parseFloat(str)
}

export {lerp, clamp, parseNumber, ratio, mod}
