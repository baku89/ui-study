import Color from '../data/Color'

const DataClass: {[s: string]: any} = {
	Color
}

export default function deserialize(text: string) {
	const data = JSON.parse(text)

	if (/^(object|array)$/.test(typeof data)) {
		deserializeObject(data)
	}
	return data

	function deserializeObject(obj: any) {
		const keys = Array.isArray(obj)
			? Array(obj.length)
					.fill(0)
					.map((_, i) => i)
			: Object.keys(obj)

		for (const key of keys) {
			const value = obj[key]
			if (Array.isArray(value) && typeof value[0] === 'string' && value[0]) {
			} else if (typeof value === 'object') {
				if (typeof value.$type === 'string') {
					obj[key] = new DataClass[value.$type](...value.value)
				} else {
					deserializeObject(value)
				}
			}
		}
	}
}
