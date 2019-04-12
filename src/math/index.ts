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

function toFixed(
	value: number,
	precision: number,
	omitZeros: boolean = true
): string {
	const fixed = (+value).toFixed(precision)
	return fixed === '0'
		? fixed
		: omitZeros
		? fixed.replace(/^(.+\.[1-9]*)0+$/, '$1').replace(/\.$/, '')
		: fixed
}

function toRadians(degrees: number) {
	return (degrees * Math.PI) / 180
}

function toDegrees(radians: number) {
	return (radians * 180) / Math.PI
}

function cycleMod(value: number, inc: number, max: number) {
	inc = (inc % max) + max
	return (value + inc) % max
}

function quantize(value: number, step: number) {
	return Math.floor(value / step + 0.5) * step
}

export {
	lerp,
	clamp,
	parseNumber,
	toFixed,
	ratio,
	mod,
	toRadians,
	toDegrees,
	cycleMod,
	quantize
}
