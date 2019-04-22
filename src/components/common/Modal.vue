<template>
	<Portal v-if="active">
		<div class="Modal" @click="close">
			<div class="Modal__frame" @click.stop>
				<slot/>
			</div>
		</div>
	</Portal>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator'

import Portal from './Portal'

@Component({
	components: {Portal}
})
export default class Modal extends Vue {
	@Prop({type: Boolean, required: true}) private active!: boolean

	private close() {
		this.$emit('update:active', false)
	}
}
</script>

<style lang="stylus">
@import '../../style/config.styl'

.Modal
	position fixed
	top 0
	left 0
	z-index 1005
	display flex
	flex-direction column
	justify-content center
	align-items center
	width 100vw
	height 100vh
	background rgba(black 0.4)

	&__frame
		position relative
		overflow scroll
		padding 1em
		width 50%
		height 50%
		border 1px solid var(--color-border-text)
		border-radius $border-radius
		background var(--color-bg)
		box-shadow 0 0 1em 0 rgba(black, 0.1)
</style>
