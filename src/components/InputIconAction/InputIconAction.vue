<template>
	<div class="InputIconAction">
		<Icon
			class="InputIconAction__icon"
			tag="button"
			:src="src"
			:size="0.8"
			:active="isPopoverOpen"
			@click="isPopoverOpen = true"
		/>
		<Popover class="InputIconAction__popover" :active.sync="isPopoverOpen" placement="right-start">
			<Menu :items="items" @click="onClick"/>
		</Popover>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import Popover from '../common/Popover.vue'
import Menu from '../common/Menu'
import Icon from '../common/Icon.vue'

type ValueType = string | number

@Component({
	components: {Popover, Menu, Icon}
})
export default class InputIconAction extends Vue {
	@Prop({type: Array, required: true}) private items!: any
	@Prop({type: String, required: true}) private src!: string
	private isPopoverOpen: boolean = false

	private onClick(newValue: ValueType) {
		this.isPopoverOpen = false
		this.$emit('click', newValue)
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

$right-arrow-width = 1em

.InputIconAction
	position relative
	width var(--layout-input-height)
	height var(--layout-input-height)

	&__icon
		position relative
		top 0
		left 0
		width 100%
		height 100%
		color var(--color-control)

		&:hover, &:active, &[active]
			color var(--color-active)
</style>

