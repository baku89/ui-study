<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {VNode} from 'vue'

@Component
export default class Icon extends Vue {
	@Prop({type: String, required: true}) private src!: string
	@Prop({type: String, default: 'span'}) private tag!: string
	@Prop({type: Number, default: 1}) private size!: number

	private render(createElement: any): VNode {
		const size = `${this.size * 100}%`
		const margin = `${((1 - this.size) / 2) * 100}%`

		return createElement(
			this.tag,
			{
				class: 'Icon',
				on: this.$listeners
			},
			[
				createElement('span', {
					class: 'Icon__img',
					style: {
						width: size,
						height: size,
						margin,
						maskImage: `url(${this.src})`
					}
				})
			]
		)
	}
}
</script>

<style lang="stylus" scoped>
.Icon
	position relative

	&__img
		position absolute
		top 0
		left 0
		background currentColor
</style>