<template>
	<div v-if="active" class="Popover__root">
		<slot ref="slot"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

@Component
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

.InputColorButton__popup
	position fixed
	top 0
	left 0
	z-index 1000
</style>

