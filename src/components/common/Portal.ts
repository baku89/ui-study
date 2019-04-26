import {Component, Vue} from 'vue-property-decorator'

@Component({})
export default class Portal extends Vue {
	private originalParentEl!: (Node & ParentNode) | null

	private mounted() {
		if (!this.originalParentEl) {
			this.originalParentEl = this.$el.parentNode
			this.$emit('initial-parent', this.$el.parentNode)
		}

		this.changeParentEl(this.$root.$el)
	}

	private beforeDestroy() {
		this.killGhostElement(this.$el)
	}

	private render() {
		const defaultSlot = this.$slots.default

		if (defaultSlot && defaultSlot[0]) {
			return defaultSlot[0]
		}
	}

	private killGhostElement(el: Element) {
		if (el.parentNode) {
			this.changeParentEl(this.originalParentEl)
			// @ts-ignore
			this.$options._parentElm = this.originalParentEl
			el.parentNode.removeChild(el)
		}
	}

	private changeParentEl(newTarget: (Node & ParentNode) | null) {
		newTarget!.appendChild(this.$el)
	}
}
