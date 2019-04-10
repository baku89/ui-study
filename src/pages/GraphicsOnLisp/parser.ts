// type Atom = number | string

// type Node = Atom | Atom[]

// export function atom(token: string): Atom {
// 	const val = parseFloat(token)
// 	return isNaN(val) ? token : val
// }

// export function tokenize(str: string): string[] {
// 	return str
// 		.replace(/(\(|\))/g, ' $1 ')
// 		.replace(/\n/g, ' ')
// 		.split(' ')
// 		.filter(x => x !== '')
// }

// export function readFrom(tokens: string[]): any {
// 	if (tokens.length === 0) {
// 		throw Error('unexpected EOF while reading')
// 	}

// 	const token: string = tokens.shift() as string

// 	if (token === '(') {
// 		const L = []
// 		while (tokens[0] !== ')') {
// 			L.push(readFrom(tokens))
// 		}
// 		tokens.shift()
// 		return L
// 	} else if (token === ')') {
// 		throw Error('unexpected )')
// 	} else {
// 		return atom(token)
// 	}
// }

// export function createEnv(outer: any, names: string[], values: Atom[]) {
// 	const dict = new Map()
// 	names.forEach((p, i) => dict.set(p, values[i]))
// 	return {
// 		set: (key: string, val: any) => dict.set(key, val) && null,
// 		get: (key: string) => (dict.has(key) ? dict.get(key) : outer),
// 		upd: (key: string, val: any) =>
// 			dict.has(key) ? dict.set(key, val) && null : outer.upd(key, val)
// 	}
// }

// export function globalEnv() {
// 	const env = createEnv(null, [], [])
// 	env.set('+', (xs: number[]) =>
// 		xs.reduce((acc: number, x: number) => acc + x, 0)
// 	)
// }

// function lEval(_x: any, _env: any) {
// 	let [x, env] = [_x, _env]
// 	for (;;) {
// 		if (typeof x === 'string') {
// 			// symbol
// 			return env.get(x)
// 		} else if (typeof x === 'number') {
// 			// number
// 			return x
// 		} else if (x[0] === 'quote') {
// 			return x.slice(1)
// 		} else if (x[0] === 'if') {
// 			const [, test, conseq, alt] = x
// 			x = lEval(test, env) ? conseq : alt // tail call
// 		} else if (x[0] === 'set!') {
// 			const [, name, exp] = x
// 			env.upd(name, lEval(exp, env))
// 			return
// 		} else if (x[0] === 'define') {
// 			const [, name, exp] = x
// 			env.set(name, lEval(exp, env))
// 			return
// 		} else if (x[0] === 'begin') {
// 			x.slice(1, x.length - 1).map(ex => lEval(ex, env))
// 			x = x[x.length - 1] // tail call
// 		} else if (x[0] === 'lambda') {
// 			const [, params, exp] = x
// 			return {env, isUDF: true, params, exp}
// 		} else {
// 			// apply function
// 			const [op, ...args] = x.map(ex => lEval(ex, env))
// 			if (isProcedure(op)) {
// 				// tail call
// 				x = op.exp
// 				env = createEnv(op.env, op.params, args)
// 			} else {
// 				return op(args)
// 			}
// 		}
// 	}
// }
