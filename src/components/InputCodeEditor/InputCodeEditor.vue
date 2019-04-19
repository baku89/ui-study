<template>
	<div class="InputCodeEditor"></div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import ace from 'brace'

@Component
export default class InputCodeEditor extends Vue {
	@Prop({type: String, required: true}) private value!: string
	@Prop({type: String, default: 'text'}) private lang!: string

	private editor!: ace.Editor

	private mounted() {
		this.editor = ace.edit(this.$el as HTMLElement)

		const theme = 'clouds'

		require(`brace/theme/${theme}`)
		require(`brace/mode/${this.lang}`)

		this.editor.getSession().setMode(`ace/mode/${this.lang}`)
		this.editor.setTheme(`ace/theme/${theme}`)
		this.editor.setValue(this.value, -1)

		this.editor.on('change', () => {
			const value = this.editor.getValue()
			this.$emit('input', value)
		})

		this.editor.setOptions({
			highlightActiveLine: false,
			showGutter: false,
			tabSize: 2,
			useSoftTabs: false
		})
		this.editor.$blockScrolling = Infinity
	}

	private beforeDestroy() {
		this.editor.destroy()
		this.editor.container.remove()
	}

	@Watch('value')
	private onValueChanged(value: string) {
		if (this.editor.getValue() !== value) {
			this.editor.setValue(value)
		}
	}

	@Watch('lang')
	private onLangChanged(lang: string) {
		this.editor.getSession().setMode(`ace/mode/${lang}`)
	}
}
</script>

<style lang="stylus" scoped>
@import '../../style/config.styl'

.InputCodeEditor
	padding 1em
	border 1px solid var(--color-border)
	border-radius $border-radius
	background var(--color-field)
	font-family var(--font-code)
</style>
