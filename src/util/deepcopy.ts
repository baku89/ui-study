import Bind from '../data/Bind'

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
	} else if (typeof src === 'object') {
		dest = Object.assign({}, src)
		Object.keys(dest).forEach(key => {
			if (typeof dest[key] === 'object' && dest[key] !== {}) {
				dest[key] = deepcopy(dest[key])
			}
		})
	} else {
		dest = src
	}
	return dest
}
