<template>
	<Portal>
		<div v-if="active" class="Popover__root">
			<slot ref="slot"/>
		</div>
	</Portal>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

import Portal from '@/components/common/Portal'

@Component({
	components: {Portal}
})
export default class Popover extends Vue {
	@Prop(Boolean) private active!: boolean

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
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

.Popover__root
	position fixed
	top 0
	left 0
	z-index 90
</style>

