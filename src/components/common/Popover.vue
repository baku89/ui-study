<template>
	<Portal class="Popover" v-if="active" @initial-parent="setOriginalParent" @destroy="killPopper">
		<slot/>
	</Portal>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import Popper from 'popper.js'
import keycode from 'keycode'

import Portal from './Portal'
import BindManager from '../../manager/BindManager'

@Component({
	components: {Portal}
})
export default class Popover extends Vue {
	@Prop({type: Boolean, default: true}) private active!: boolean
	@Prop({type: String, default: 'bottom'}) private placement!: string
	@Prop(String) private position!: undefined | 'cursor'

	private popperInstance!: Popper | null
	private referenceEl!: Node & ParentNode | object

	public setReference(el: any) {
		this.referenceEl = el
		if (this.popperInstance) {
			this.killPopper()
			this.bindPopper()
		}
	}

	private mounted() {
		this.resetPopper()
	}

	private beforeDestroy() {
		window.removeEventListener('mousedown', this.onMousedown)
		window.removeEventListener('keydown', this.onKeydown)
	}

	@Watch('active', {immediate: true})
	private onActiveChanged(active: boolean) {
		if (active) {
			// Automatically close the popover when user clicks outside of Popovers
			window.addEventListener('mousedown', this.onMousedown)
			window.addEventListener('keydown', this.onKeydown)

			if (this.position === 'cursor') {
				const x = BindManager.mousePosition[0]
				const y = BindManager.mousePosition[1]
				this.referenceEl = {
					getBoundingClientRect: () => ({
						top: y,
						right: x,
						bottom: y,
						left: x,
						width: 0,
						height: 0
					}),
					clientWidth: 0,
					clientHeight: 0
				}
			}
			this.bindPopper()
		} else {
			window.removeEventListener('mousedown', this.onMousedown)
			window.removeEventListener('keydown', this.onKeydown)
		}
	}

	private setOriginalParent(el: Node & ParentNode) {
		if (!this.referenceEl) {
			this.referenceEl = el
		}
	}

	private killPopper() {
		if (this.popperInstance) {
			this.popperInstance.destroy()
			this.popperInstance = null
		}
	}

	private bindPopper() {
		this.$nextTick().then(() => {
			if (this.referenceEl) {
				this.createPopper()
			}
		})
	}

	private createPopper() {
		// @ts-ignore
		this.popperInstance = new Popper(this.referenceEl, this.$el, {
			placement: this.placement
		})
	}

	private resetPopper() {
		if (this.popperInstance) {
			this.killPopper()
			this.createPopper()
		}
	}

	private onMousedown(e: Event) {
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
			this.$emit('update:active', false)
			this.$emit('close')
		}
	}

	private onKeydown(e: KeyboardEvent) {
		if (keycode.isEventKey(e, 'esc')) {
			this.$emit('update:active', false)
			this.$emit('close')
		}
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

.Popover
	z-index 2000
</style>

