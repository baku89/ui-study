import * as clamp from 'clamp'

export function percentage(value: number, min: number = 0, max: number = 1): string {
	const t = (value - min) / (max - min)
	const p = clamp(t, 0, 1) * 100
	return p.toString() + '%'
}

export function mod(a: number, b: number): number {
	return ((a % b) + b) % b
}

export function fit01(t: number, min: number, max: number): number {
	return min + t * (max - min)
}

export function calcPrecision(a:number) : number {
	if (!isFinite(a)) return 0
	let e = 1, p = 0
	while (Math.round(a * e) / e !== a) {
		e *= 10
		p++
	}
	return p
}