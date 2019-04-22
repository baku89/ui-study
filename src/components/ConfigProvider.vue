<template>
	<div class="ConfigProvider">
		<slot :lang="lang"></slot>
	</div>
</template>


<script lang="ts">
import {Component, Vue, Watch, Provide} from 'vue-property-decorator'

const angleStep = 30

@Component({
	provide() {
		return {
			Config: this.$data,
			...this.$data
		}
	}
})
export default class ConfigProvider extends Vue {
	private lang: string = 'en'
	private keySlower: string = 'alt'
	private keyFaster: string = 'shift'
	private keySymmetry: string = 's'
	private keyQuantize: string = 'q'
	private keyScale: string = 'alt'
	private quantizeAngles: number[] = Array(360 / angleStep)
		.fill(0)
		.map((v, i) => i * angleStep)

	public set(name: string, value: any) {
		this.$set(this.$data, name, value)

		if (name === 'lang') {
			document.body.classList.remove('en', 'ja')
			document.body.classList.add(value)
		}
	}

	private mounted() {
		document.body.classList.add(this.lang)
	}
}
</script>

<style lang="stylus" scoped>
.ConfigProvider
	height 100%
</style>
