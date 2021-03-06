import keycode from 'keycode'
import EventEmitter from 'eventemitter3'
import WebMidi, {InputEventBase} from 'webmidi'
import {vec2} from 'gl-matrix'

export interface BindEvent {
	address: string
	value: number | boolean
	originalEvent?: any
}

class BindManager extends EventEmitter {
	private _mousePosition = vec2.create()
	private toggleTable = new Map<string, boolean>()
	private detectHandler: {
		type: string
		callback: EventEmitter.ListenerFn
		reject: (reason?: any) => void
	} | null = null

	constructor() {
		super()
		this.setupMouse()
		this.setupKeyboard()
		this.setupMidi()
		this.setupGamepad()
	}

	public get mousePosition(): vec2 {
		return this._mousePosition
	}

	public keycode(e: Event): string {
		let key = keycode(e)

		if (/^(left|right) command$/.test(key)) {
			key = 'cmd'
		}

		return key
	}

	public pressed(address: string): boolean {
		return this.toggleTable.get(address) || false
	}

	public async detect(
		type: undefined | 'press' | 'change' = 'press'
	): Promise<string> {
		this.abortDetection()

		return new Promise((resolve, reject) => {
			this.detectHandler = {
				type,
				callback: (e: BindEvent) => {
					if (e.originalEvent instanceof Event) {
						e.originalEvent.preventDefault()
					}
					this.detectHandler = null
					resolve(e.address)
				},
				reject
			}

			this.once(type, this.detectHandler.callback)
		})
	}

	public abortDetection() {
		if (this.detectHandler !== null) {
			const {type: eventType, callback, reject} = this.detectHandler
			this.detectHandler = null
			this.off(eventType, callback)
			reject('Aborted')
		}
	}

	private setupMouse() {
		window.addEventListener('mousemove', (e: MouseEvent) => {
			vec2.set(this.mousePosition, e.pageX, e.pageY)
		})
	}

	private setupKeyboard() {
		window.addEventListener('keydown', (e: KeyboardEvent) => {
			const key = this.keycode(e)
			const address = `/key/${key}`
			this.toggleTable.set(address, true)

			const activeElement = document.activeElement
			if (
				activeElement instanceof HTMLInputElement &&
				/^(text|number)$/.test(activeElement.type)
			) {
				return
			}

			const payload = {address, value: false, originalEvent: e}

			this.emit('press', payload)
			this.emit(`press:${address}`, payload)
		})

		window.addEventListener('keyup', (e: KeyboardEvent) => {
			const key = this.keycode(e)
			const address = `/key/${key}`
			const payload = {address, value: false, originalEvent: e}

			this.toggleTable.set(address, false)
			this.emit('release', payload)
			this.emit(`release:${address}`, payload)
		})
	}

	private setupMidi() {
		WebMidi.enable(err => {
			if (err) {
				console.warn(err)
				return
			}

			const onMidimessage = ({data}: InputEventBase<'midimessage'>) => {
				const [_, ch, velocity] = data
				const pressed = velocity > 64
				const address = `/midi/ch${ch}`
				const toggleType = pressed ? 'press' : 'release'
				const togglePayload = {address, value: pressed}
				const changePayload = {address, value: velocity}

				this.toggleTable.set(address, pressed)

				this.emit(toggleType, togglePayload)
				this.emit(`${toggleType}:${address}`, togglePayload)

				this.emit('change', changePayload)
				this.emit(`change:${address}`, changePayload)
			}

			WebMidi.inputs.forEach(input => {
				input.addListener('midimessage', 'all', onMidimessage)
			})
		})
	}

	private setupGamepad() {
		const shouldScan = !('ongamepadconnected' in window)
		const controllers: {
			[index: number]: {
				gamepad: Gamepad
				buttons: boolean[]
				axes: number[]
			}
		} = {}

		let rafId: number

		const scanGamepads = () => {
			const gamepads = navigator.getGamepads()
			for (const gamepad of gamepads) {
				if (gamepad) {
					controllers[gamepad.index].gamepad = gamepad
				}
			}
		}

		const updateStatus = () => {
			if (shouldScan) {
				scanGamepads()
			}

			// Detect change and Copy
			for (const {gamepad, buttons, axes} of Object.values(controllers)) {
				for (let i = 0; i < buttons.length; i++) {
					const pressed = gamepad.buttons[i].pressed
					const prevPressed = buttons[i]

					if (pressed !== prevPressed) {
						const address = `/gamepad/${gamepad.index}/button/${i}`
						const type = pressed ? 'press' : 'release'
						const payload = {address, value: pressed}

						this.toggleTable.set(address, pressed)
						this.emit(type, payload)
						this.emit(`${type}:${address}`, payload)
					}

					buttons[i] = pressed
				}
				for (let i = 0; i < axes.length; i++) {
					const value = gamepad.axes[i]
					const prevValue = axes[i]

					if (value !== prevValue) {
						const address = `/gamepad/${gamepad.index}/button/${i}`
						const payload = {address, value}
						this.emit('change', payload)
						this.emit(`change:${address}`, payload)
					}

					axes[i] = gamepad.axes[i]
				}
			}

			rafId = requestAnimationFrame(updateStatus)
		}

		window.addEventListener('gamepadconnected', _e => {
			const {gamepad} = _e as GamepadEvent
			controllers[gamepad.index] = {
				gamepad,
				buttons: gamepad.buttons.map(button => button.pressed),
				axes: gamepad.axes.map(axe => axe)
			}
			rafId = requestAnimationFrame(updateStatus)
		})

		window.addEventListener('gamepaddisconnected', _e => {
			const {gamepad} = _e as GamepadEvent
			delete controllers[gamepad.index]
			if (Object.keys(controllers).length === 0) {
				cancelAnimationFrame(rafId)
			}
		})
	}
}

export default new BindManager()
