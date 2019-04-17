<template>
	<li class="Param">
		<div class="Param__icon" :active="icon !== null" @click="$emit('icon-clicked')">{{iconText}}</div>
		<label class="Param__label">
			<slot name="label"/>
		</label>
		<div class="Param__field">
			<slot/>
		</div>
		<div class="Param__menu">
			<Icon tag="div" class="Param__drag handle" src="./assets/icon_drag-handle.svg" :size="0.8"/>
			<Icon
				tag="button"
				class="Param__remove"
				@click="$emit('remove')"
				src="./assets/icon_cross.svg"
				:size="0.7"
			/>
		</div>
	</li>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import Icon from '../../components/common/Icon.vue'

@Component({
	components: {Icon}
})
export default class Param extends Vue {
	@Prop({type: String, default: null}) private icon!:
		| 'active'
		| 'translate'
		| 'scale'
		| 'rotate'
		| null

	private get iconText(): string {
		if (this.icon === null) {
			return '·'
		} else if (this.icon === 'active') {
			return 'O'
		} else {
			return this.icon.substr(0, 1).toUpperCase()
		}
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

.Param
	display flex
	padding-bottom 0.8em

	&__icon
		position relative
		margin calc(var(--input-height) * 0.2)
		width calc(var(--input-height) * 0.6)
		height calc(var(--input-height) * 0.6)
		text-align center
		line-height calc(var(--input-height) * 0.6)

		&[active]
			border-radius 50%
			background var(--color-active)
			color var(--color-bg)

	&__label
		padding 0 0.2em
		width 7em
		line-height var(--input-height)

	&__field
		flex-grow 1

	&__menu
		display none
		width calc(var(--input-height) * 2)
		height var(--input-height)

		^[0]:hover &
			display flex

	&__drag, &__remove
		width var(--input-height)
		color var(--color-control)

	&__drag
		cursor grab

	&__remove:hover
		color var(--color-active)
</style>
