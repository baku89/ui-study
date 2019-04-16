import keycode from 'keycode'

const KEYS = new Map<string, boolean>()

window.addEventListener('keydown', (e: KeyboardEvent) => {
	const key = keycode(e)
	KEYS.set(key, true)
})

window.addEventListener('keyup', (e: KeyboardEvent) => {
	const key = keycode(e)
	KEYS.set(key, false)
})

function keypressed(key: string): boolean {
	return KEYS.get(key) || false
}

export default keypressed
