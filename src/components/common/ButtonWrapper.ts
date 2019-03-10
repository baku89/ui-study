import {Component, Prop, Vue} from 'vue-property-decorator'
// @ts-ignore
import mouse from 'mouse-event'

@Component
export default class ButtonWrapper extends Vue {
	private mounted() {
		this.initEventHandlers()
	}

	private initEventHandlers() {
		const slot = this.$slots.default![0]

		if (!slot) {
			console.error('Slot is not defined')
			return
		}

		const buttonElement = slot.elm as HTMLElement

		if (!buttonElement || !(buttonElement instanceof HTMLElement)) {
			console.error('Slot is not HTMLElment')
			return
		}

		buttonElement.addEventListener('mousedown', (e: MouseEvent) => {
			const buttons = mouse.buttons(e)
			if (buttons === 1) {
				window.addEventListener(
					'mouseup',
					() => {
						buttonElement.blur()
					},
					{once: true}
				)
			}
		})
	}

	private render() {
		return this.$slots.default![0]
	}
}
