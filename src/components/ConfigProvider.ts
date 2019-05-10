import {Component, Vue} from 'vue-property-decorator'
import Case from 'case'

import {ConfigDefault} from '../core/config'
import Color from '../data/Color'
import deepcopy from '../util/deepcopy'

@Component({
	data() {
		return {
			Config: deepcopy(ConfigDefault)
		}
	},
	provide() {
		return {
			Config: this.$data.Config
		}
	}
})
export default class ConfigProvider extends Vue {
	private Config!: any

	private get attrElement(): HTMLElement {
		return document.documentElement
	}

	private created() {
		this.$watch('Config.lang', this.updateLang, {immediate: true})
	}

	private mounted() {
		// Set theme
		const {theme} = this.Config
		for (const key of Object.keys(theme)) {
			this.$watch(
				`Config.theme.${key}`,
				(newValue: any) => {
					this.updateThemeProperty(key, newValue)
				},
				{immediate: true}
			)
		}
	}

	private render() {
		return this.$scopedSlots.default!({
			Config: this.Config
		})
	}

	private updateLang(lang: string = this.Config.lang) {
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
