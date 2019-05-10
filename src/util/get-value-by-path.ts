export default function getValueByPath(data: any, path: string) {
	const keys = path
		.split('/')
		.filter((k: string) => !!k)
		.map((k: string) => (/^[0-9]+$/.test(k) ? parseInt(k, 10) : k))

	let value = data
	for (const key of keys) {
		if (value[key] === undefined) {
			value[key] = {}
		}
		value = value[key]
	}

	return value
}
