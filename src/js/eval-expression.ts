export default function evalExpression(exp: string, currentValue: number): number {

	let value

	console.log('expression detected')

	try {
		const func = new Function('x', `with(Math) {const pi = PI; return ${exp}; }`)
		value = parseFloat(func(currentValue))
	} catch(err) {
		console.log('invalid expression', err)
		value = NaN
	}

	console.log('result=', value)

	return value
}