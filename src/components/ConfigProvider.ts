import {Component, Vue, Watch, Provide} from 'vue-property-decorator'

const angleStep = 30

@Component
export default class ConfigProvider extends Vue {
	// Key
	@Provide() private keySlower: string = 'alt'
	@Provide() private keyFaster: string = 'shift'
	@Provide() private keySymmetry: string = 's'
	@Provide() private keyQuantize: string = 'q'
	@Provide() private keyScale: string = 'alt'

	@Provide() private quantizeAngles: number[] = Array(360 / angleStep)
		.fill(0)
		.map((v, i) => i * angleStep)

	private render() {
		const defaultSlot = this.$slots.default
		if (defaultSlot && defaultSlot[0]) {
			return defaultSlot[0]
		}
	}
}
