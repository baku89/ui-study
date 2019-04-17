<template>
	<Portal v-if="active" @initial-parent="setOriginalParent" @destroy="killPopper">
		<div class="Popover">
			<slot/>
		</div>
	</Portal>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import Popper from 'popper.js'
import keycode from 'keycode'

import Portal from './Portal'

@Component({
	components: {Portal}
})
export default class Popover extends Vue {
	@Prop(Boolean) private active!: boolean
	@Prop({type: String, default: 'bottom'}) private placement!: string

	private popperInstance!: Popper | null
	private originalParentEl!: Node & ParentNode

	private mounted() {
		this.resetPopper()
	}

	@Watch('active')
	private onActiveChanged(active: boolean) {
		if (!active) {
			return
		}
		// Automatically close the popover when user clicks outside of Popovers
		const onMousedown = (e: Event) => {
			// Search all $el of descendant "Popover"s
			const popovers = [this.$el]
			const searchPortals = (children: Vue[]) => {
				children.forEach(node => {
					if (
						node.$el.nodeName !== '#comment' &&
						node.$options.name === 'Popover'
					) {
						popovers.push(node.$el)
					}
					if (node.$children) {
						searchPortals(node.$children)
					}
				})
			}
			searchPortals(this.$children)

			const clickedOutside = popovers.every(popover => {
				return !e.composedPath().includes(popover)
			})

			if (clickedOutside) {
				window.removeEventListener('mousedown', onMousedown)
				this.$emit('update:active', false)
				this.$emit('close')
			}
		}
		window.addEventListener('mousedown', onMousedown)

		const onKeydown = (e: KeyboardEvent) => {
			if (keycode.isEventKey(e, 'esc')) {
				window.removeEventListener('keydown', onKeydown)
				this.$emit('update:active', false)
				this.$emit('close')
			}
		}
		window.addEventListener('keydown', onKeydown)

		this.bindPopper()
	}

	private setOriginalParent(el: Node & ParentNode) {
		if (!this.originalParentEl) {
			this.originalParentEl = el
		}
	}

	public setReference(el: Element) {
		this.originalParentEl = el
	}

	private killPopper() {
		if (this.popperInstance) {
			this.popperInstance.destroy()
			this.popperInstance = null
		}
	}

	private bindPopper() {
		this.$nextTick().then(() => {
			if (this.originalParentEl) {
				this.createPopper()
			}
		})
	}

	private createPopper() {
		const referenceEl = this.originalParentEl as Element
		// @ts-ignore
		this.popperInstance = new Popper(referenceEl, this.$el, {
			placement: this.placement
		})
	}

	private resetPopper() {
		if (this.popperInstance) {
			this.killPopper()
			this.createPopper()
		}
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

.Popover
	z-index 90
</style>

