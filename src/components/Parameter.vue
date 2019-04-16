<template>
	<div class="Parameter">
		<label class="Parameter__label" v-if="label">{{label}}</label>
		<div class="Parameter__field">
			<slot/>
		</div>
	</div>
</template>


<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class Parameter extends Vue {
	@Prop(String) private label!: string
}
</script>

<style lang="stylus" scoped>
@import '../style/config.styl'

.Parameter
	display flex
	padding-top calc(0.5 * (var(--param-height) - var(--input-height)))
	padding-bottom calc(0.5 * (var(--param-height) - var(--input-height)))

	&__label
		width 6em
		line-height var(--input-height)

	&__field
		display flex
		flex-grow 1

		& > .grow
			flex-grow 1
</style>


