export default function splitToParentAndKey(path: string) {
	const lastSlashIndex = path.lastIndexOf('/')

	const parent = path.substr(0, lastSlashIndex)
	let key: string | number = path.substr(lastSlashIndex + 1)

	if (/^[0-9]+$/.test(key)) {
		key = parseInt(key, 10)
	}

	return [parent, key]
}
