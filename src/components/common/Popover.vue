<template>
	<Portal @initial-parent="setOriginalParent" @destroy="killPopper">
		<div v-if="active" class="Popover popper">
			<slot/>
		</div>
	</Portal>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import Popper from 'popper.js'

import Portal from '@/components/common/Portal'

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
		const close = (e: Event) => {
			// @ts-ignore
			if (e.path.indexOf(this.$el) === -1) {
				window.removeEventListener('mousedown', close)
				this.$emit('update:active', false)
			}
		}
		window.addEventListener('mousedown', close)

		this.bindPopper()
	}

	private setOriginalParent(el: Node & ParentNode) {
		if (!this.originalParentEl) {
			this.originalParentEl = el
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

