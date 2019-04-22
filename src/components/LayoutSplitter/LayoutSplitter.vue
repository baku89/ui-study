<template>
	<div class="LayoutSplitter" @mouseup="onMouseup" @mousemove="onMousemove" :style="elStyles">
		<div :style="{[paneWidthAttr]: percent}" ref="first">
			<slot name="first"/>
		</div>

		<div
			class="LayoutSplitter__resizer"
			:class="{[split]: true, dragging: isDragging}"
			:style="{[resizerOffsetAttr]: percent}"
			@mousedown="onMousedown"
		/>

		<div :style="{[paneWidthAttr]: `calc(100% - ${percent}`}">
			<slot name="second"/>
		</div>

		<div class="LayoutSplitter__measure" :style="{[paneWidthAttr]: min}" ref="measureMin"/>
		<div class="LayoutSplitter__measure" :style="{[paneWidthAttr]: max}" ref="measureMax"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

@Component({})
export default class LayoutSplitter extends Vue {
	@Prop({type: String, default: '50%'}) private default!: string
	@Prop({type: String, default: '10%'}) private min!: string
	@Prop({type: String, default: '90%'}) private max!: string
	@Prop({type: String, required: true}) private split!:
		| 'vertical'
		| 'horizontal'

	private isDragging: boolean = false
	private hasMoved: boolean = false
	private percent: string = this.default

	// Computed
	private get paneWidthAttr(): string {
		return this.split === 'vertical' ? 'width' : 'height'
	}

	private get resizerOffsetAttr(): string {
		return this.split === 'vertical' ? 'left' : 'top'
	}

	private get elStyles(): object {
		return {
			flexDirection: this.split === 'vertical' ? 'row' : 'column',
			userSelect: this.isDragging ? 'none' : '',
			cursor: this.isDragging ? 'col-resize' : ''
		}
	}

	// Lifecycle hooks
	private mounted() {
		window.addEventListener('resize', this.calcSplitPosition)
	}

	private beforeDestroy() {
		window.removeEventListener('resize', this.calcSplitPosition)
	}

	// Methods
	private onMousedown() {
		this.isDragging = true
		this.hasMoved = false
	}

	private onMouseup() {
		this.isDragging = false
	}

	private onMousemove(e: MouseEvent) {
		if (this.isDragging) {
			let offset = 0
			let target = e.currentTarget as HTMLElement

			if (this.split === 'vertical') {
				while (target) {
					offset += target.offsetLeft
					target = target.offsetParent as HTMLElement
				}
			} else {
				while (target) {
					offset += target.offsetTop
					target = target.offsetParent as HTMLElement
				}
			}
			const currentPage = this.split === 'vertical' ? e.pageX : e.pageY
			const currentTarget = e.currentTarget as HTMLElement

			const widthAttr =
				this.split === 'vertical' ? 'offsetWidth' : 'offsetHeight'

			const containerWidth = (this.$el as HTMLElement)[widthAttr]
			const ratio = (currentPage - offset) / containerWidth

			const resizedWidth = ratio * containerWidth

			const measureMin = this.$refs.measureMin as HTMLElement
			const measureMax = this.$refs.measureMax as HTMLElement

			if (resizedWidth <= measureMin[widthAttr]) {
				this.percent = this.min
			} else if (resizedWidth >= measureMax[widthAttr]) {
				this.percent = this.max
			} else {
				this.percent = `${ratio * 100}%`
			}

			this.hasMoved = true
		}
	}

	private calcSplitPosition() {
		const currentWidth = (this.$refs.first as HTMLElement).clientWidth
		const widthAttr = this.split === 'vertical' ? 'offsetWidth' : 'offsetHeight'

		const measureMin = this.$refs.measureMin as HTMLElement
		const measureMax = this.$refs.measureMax as HTMLElement

		if (currentWidth <= measureMin[widthAttr]) {
			this.percent = this.min
		} else if (currentWidth >= measureMax[widthAttr]) {
			this.percent = this.max
		}
	}

	// Watchers
	@Watch('defaultPercent')
	private onDefaultPercentChanged(newValue: string) {
		this.percent = newValue
	}
}
</script>

<style lang="stylus">
.LayoutSplitter
	display flex

	&__resizer
		$width = 0.8em
		position absolute
		z-index 1
		background var(--color-active)
		opacity 0

		&:hover, &.dragging
			opacity 0.2

		&.horizontal
			margin-top -0.5 * $width
			width 100%
			height $width
			cursor row-resize

		&.vertical
			margin-left -0.5 * $width
			width $width
			height 100%
			cursor col-resize

	&__measure
		position absolute
		visibility hidden
</style>
