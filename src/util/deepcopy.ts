function isPlainObject(obj: any) {
	return obj !== null && typeof obj === 'object'
}

export default function deepcopy(src: any) {
	let dest: any
	if (Array.isArray(src)) {
		dest = src.slice(0) || []
		dest.forEach((n: any) => {
			if ((typeof n === 'object' && n !== {}) || Array.isArray(n)) {
				n = deepcopy(n)
			}
		})
	} else if (typeof src.clone === 'function') {
		dest = src.clone()
	} else if (isPlainObject(src)) {
		dest = Object.assign({}, src)
		Object.keys(dest).forEach(key => {
			if (isPlainObject(dest[key])) {
				dest[key] = deepcopy(dest[key])
			}
		})
	} else {
		dest = src
	}
	return dest
}
