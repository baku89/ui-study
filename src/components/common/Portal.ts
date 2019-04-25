import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

@Component({})
export default class Portal extends Vue {
	private originalParentEl!: (Node & ParentNode) | null

	@Prop(Boolean) private attachToParent!: boolean
	@Prop({
		type: undefined,
		validator(value: any) {
			return value && value instanceof HTMLElement
		}
	})
	private target!: HTMLElement

	private mounted() {
		if (!this.originalParentEl) {
			this.originalParentEl = this.$el.parentNode
			this.$emit('initial-parent', this.$el.parentNode)
		}

		if (this.attachToParent && this.$el.parentNode!.parentNode) {
			this.changeParentEl(this.$el.parentNode!.parentNode)
		} else if (document) {
			this.changeParentEl(this.target || this.$root.$el || document.body)
		}
	}

	private beforeDestroy() {
		if (this.$el.classList) {
			this.initDestroy()
		} else {
			this.killGhostElement(this.$el)
		}
	}

	private render() {
		const defaultSlot = this.$slots.default

		if (defaultSlot && defaultSlot[0]) {
			return defaultSlot[0]
		}
	}

	@Watch('target')
	private onTargetChanged(newTarget: any, oldTarget: any) {
		this.changeParentEl(newTarget)

		if (oldTarget) {
			this.$forceUpdate()
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

	private initDestroy(manualCall: boolean = false) {
		let el = this.$el

		if (manualCall && this.$el.nodeType === Node.COMMENT_NODE) {
			el = this.$vnode.elm as Element
		}

		this.destroyElement(el)
	}

	private destroyElement(el: any) {
		requestAnimationFrame(() => {
			this.$emit('destroy')
			this.killGhostElement(el)
		})
	}

	private changeParentEl(newTarget: (Node & ParentNode) | null) {
		newTarget!.appendChild(this.$el)
	}
}
