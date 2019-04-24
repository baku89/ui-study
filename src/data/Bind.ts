import keycode from 'keycode'
import WebMidi, {InputEventControlchange} from 'webmidi'

WebMidi.enable(err => {
	if (err) {
		console.warn(err)
	}
})

export default class Bind {
	public source: string
	public address: string

	constructor(source: string = '', address: string = '') {
		this.source = source
		this.address = address
	}

	public async detect(): Promise<string> {
		return new Promise((resolve, reject) => {
			if (this.source === 'key') {
				window.addEventListener(
					'keydown',
					(e: Event) => {
						e.preventDefault()
						const address = keycode(e)
						resolve(address)
					},
					{once: true}
				)
			} else if (this.source === 'midi') {
				if (!WebMidi.enabled) {
					reject('No MIDI device is ready.')
				} else {
					const onControlchange = (e: InputEventControlchange) => {
						resolve(`ch.${e.data[1]}`)
						WebMidi.inputs.forEach(input => {
							input.removeListener('controlchange', 'all', onControlchange)
						})
					}

					WebMidi.inputs.forEach(input => {
						input.addListener('controlchange', 'all', onControlchange)
					})
				}
			}
		})
	}

	public clone() {
		return new Bind(this.source, this.address)
	}

	public get path(): string {
		return `/${this.source}/${this.address}`
	}
}

// import {observable, computed} from 'mobx'

// class Name extends Vue {
// 	// @observable
// 	public first = 'Baku'

// 	// @observable
// 	public last = 'Hashimoto'

// 	// @computed
// 	public get full(): string {
// 		console.log('computed!')
// 		return `${this.first} ${this.last}`
// 	}
// }

// import Vue from 'vue'

// const vm = new Vue({
// 	data: {name: new Name()}
// })

// window.vm = vm
// window.Name = Name
