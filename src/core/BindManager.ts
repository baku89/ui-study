import keycode from 'keycode'
import WebMidi, {InputEventControlchange} from 'webmidi'
import Bind from '../data/Bind'

class BindManager {
	private toggleTable = new Map<string, boolean>()

	constructor() {
		this.setupKeyboard()
		this.setupMidi()
	}

	public keycode(e: Event): string {
		let key = keycode(e)

		if (/^(left|right) command$/.test(key)) {
			key = 'cmd'
		}

		return key
	}

	public pressed(bind: Bind): boolean {
		return this.toggleTable.get(bind.path) || false
	}

	private setupKeyboard() {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			const key = this.keycode(e)
			this.toggleTable.set(`/key/${key}`, true)
		})

		document.addEventListener('keyup', (e: KeyboardEvent) => {
			const key = this.keycode(e)
			this.toggleTable.set(`/key/${key}`, false)
		})
	}

	private setupMidi() {
		WebMidi.enable(err => {
			if (err) {
				console.warn(err)
				return
			}

			const onControlchange = ({data}: InputEventControlchange) => {
				const [_, ch, velocity] = data
				this.toggleTable.set(`/midi/ch.${ch}`, velocity > 64)
			}

			WebMidi.inputs.forEach(input => {
				input.addListener('controlchange', 'all', onControlchange)
			})
		})
	}
}

export default new BindManager()
