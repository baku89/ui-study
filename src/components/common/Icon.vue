<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: 'Icon',
	// @ts-ignore
	functional: true,
	props: {
		src: {
			type: String,
			required: true
		},
		tag: {
			type: String,
			default: 'span'
		},
		size: {
			type: Number,
			default: 1
		}
	},
	render(h: any, context: any) {
		const {
			data,
			props: {src, tag, size}
		} = context

		const width = `${size * 100}%`
		const margin = `${((1 - size) / 2) * 100}%`

		data.attrs[`${context.parent.$options._scopeId}`] = ''

		return h(tag, {...data, class: 'Icon'}, [
			h('span', {
				class: 'Icon__img',
				style: {
					width,
					height: width,
					margin,
					maskImage: `url(${src})`
				}
			})
		])
	}
})

// import {Component, Prop, Vue, Provide, Inject} from 'vue-property-decorator'

// @Component({})
// export default class Icon extends Vue {
// 	@Prop({type: String, required: true}) private src!: string
// 	@Prop({type: String, default: 'span'}) private tag!: string
// 	@Prop({type: Number, default: 1}) private size!: number

// 	private render(createElement: any): VNode {
// 		const size = `${this.size * 100}%`
// 		const margin = `${((1 - this.size) / 2) * 100}%`

// 		return createElement(
// 			this.tag,
// 			{
// 				class: 'Icon',
// 				on: this.$listeners
// 			},
// 			[
// 				createElement('span', {
// 					class: 'Icon__img',
// 					style: {
// 						width: size,
// 						height: size,
// 						margin,
// 						maskImage: `url(${this.src})`
// 					}
// 				})
// 			]
// 		)
// 	}
// }
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

