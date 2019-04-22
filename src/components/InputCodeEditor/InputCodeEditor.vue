<template>
	<div class="InputCodeEditor">
		<div class="InputCodeEditor__editor" ref="editor"/>
	</div>
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
		this.editor = ace.edit(this.$refs.editor as HTMLElement)

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
			useSoftTabs: false,
			maxLines: Infinity
		})
	}

	private beforeDestroy() {
		this.editor.destroy()
		this.editor.container.remove()
	}

	@Watch('value')
	private onValueChanged(newValue: string) {
		if (this.editor.getValue() !== newValue) {
			this.editor.setValue(newValue)
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
	position relative
	overflow scroll
	border 1px solid var(--color-border)
	border-radius $border-radius
	font-family var(--font-code)

	&__editor
		position relative
		width 100%
</style>
