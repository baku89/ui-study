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
	console.log(key)
	return KEYS.has(key) ? (KEYS.get(key) as boolean) : false
}

export default keypressed
