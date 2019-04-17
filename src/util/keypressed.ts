import keycode from 'keycode'

const KEYS_TABLE = new Map<string, boolean>()

function normalizeKeycode(e: KeyboardEvent) {
	let key = keycode(e)

	if (/^(left|right) command$/.test(key)) {
		key = 'cmd'
	}

	return key
}

document.addEventListener('keydown', (e: KeyboardEvent) => {
	const key = normalizeKeycode(e)
	KEYS_TABLE.set(key, true)
})

document.addEventListener('keyup', (e: KeyboardEvent) => {
	const key = normalizeKeycode(e)
	KEYS_TABLE.set(key, false)
})

function keypressed(key: string): boolean {
	return KEYS_TABLE.get(key) || false
}

export default keypressed
