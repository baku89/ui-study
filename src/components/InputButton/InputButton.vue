<template>
	<button class="InputButton" :square="onlyIcon" v-on="$listeners" ref="button">
		<Icon class="InputButton__icon" v-if="icon && iconPosition === 'left'" :src="icon" :size=".8"/>
		<span class="InputButton__label" v-if="label">{{label}}</span>
		<Icon class="InputButton__icon" v-if="icon && iconPosition === 'right'" :src="icon" :size=".8"/>
	</button>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import {setButtonUnfocusableForMouse} from '../../util'
import Icon from '../common/Icon.vue'
import {VNode} from 'vue'

@Component({components: {Icon}})
export default class InputButton extends Vue {
	@Prop(String) private label!: string
	@Prop(String) private icon!: string
	@Prop({type: String, default: 'left'}) private iconPosition!: 'left' | 'right'

	private mounted() {
		setButtonUnfocusableForMouse(this.$refs.button as HTMLElement)
	}

	private get onlyIcon(): boolean {
		return this.label === undefined && this.icon !== undefined
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

.InputButton
	height var(--layout-input-height)
	input-border-style()
	input-field-style()
	input-placement-modifier-root()
	input-placement-modifier-border()
	display flex
	border-color var(--color-control)
	background transparent
	color var(--color-control-text)

	&[square]
		padding 0
		width var(--layout-input-height)

	&:hover, &:focus
		input-border-hover-style()

	&:active
		input-border-focus-style()
		background var(--color-active)
		color var(--color-bg)

	&__icon
		display block
		width calc(var(--layout-input-height) - 2px)
		height @width

	&__label
		display block
		padding 0 0.2em
</style>
