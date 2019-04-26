import {Component, Vue, Watch, Provide, Inject} from 'vue-property-decorator'
import Case from 'case'

import {DefaultConfig, DataConfig} from '../core'
import deepcopy from '../util/deepcopy'
import Color from 'src/data/Color'

@Component({
	data() {
		return {
			Config: deepcopy(DefaultConfig)
		}
	},
	provide() {
		return {
			Config: this.$data.Config
		}
	}
})
export default class ConfigProvider extends Vue {
	@Inject({from: 'Config', default: null}) private ParentConfig!: DataConfig

	private get attrElement(): HTMLElement {
		return this.ParentConfig
			? (this.$el as HTMLElement)
			: document.documentElement
	}

	private mounted() {
		this.updateLang()

		// Set theme
		const {theme} = this.$data.Config
		for (const key of Object.keys(theme)) {
			this.$watch(`Config.theme.${key}`, (newValue: any) => {
				this.updateThemeProperty(key, newValue)
			})
			this.updateThemeProperty(key, theme[key])
		}
	}

	private render() {
		return this.$scopedSlots.default!({
			Config: this.$data.Config
		})
	}

	@Watch('Config.lang', {deep: true})
	private updateLang(lang: string = this.$data.Config.lang) {
		this.attrElement.classList.remove('en', 'ja')
		this.attrElement.classList.add(lang)
	}

	private updateThemeProperty(key: string, value: any) {
		const variableName = `--${Case.kebab(key)}`
		let cssValue = value

		if (/^color/.test(key)) {
			cssValue = (value as Color).cssColor
		} else if (/^layout/.test(key)) {
			cssValue += 'em'
		} else if (key === 'fontSize') {
			cssValue += 'px'
		}
		this.attrElement.style.setProperty(variableName, cssValue)
	}
}
