import {Component, Vue, Watch, Provide} from 'vue-property-decorator'

const angleStep = 30

@Component({
	data() {
		return {
			Config: {
				lang: 'en',
				keySlower: 'alt',
				keyFaster: 'shift',
				keySymmetry: 's',
				keyQuantize: 'q',
				keyScale: 'alt',
				quantizeAngles: Array(360 / angleStep)
					.fill(0)
					.map((v, i) => i * angleStep)
			}
		}
	},
	provide() {
		return {
			Config: this.$data.Config,
			...this.$data.Config
		}
	}
})
export default class ConfigProvider extends Vue {

	@Watch('Config', {deep: true})
	public onChangeConfig(Config: any) {
		document.body.classList.remove('en', 'ja')
		document.body.classList.add(Config.lang)
	}
	private mounted() {
		document.body.classList.add(this.$data.Config.lang)
	}

	private render() {
		return this.$scopedSlots.default!({
			Config: this.$data.Config
		})
	}
}
