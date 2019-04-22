<template>
	<div class="ConfigProvider">
		<slot :lang="lang"></slot>
	</div>
</template>


<script lang="ts">
import {Component, Vue, Watch, Provide} from 'vue-property-decorator'

const angleStep = 30

@Component({
	data() {
		return {
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
	},
	provide() {
		return {
			Config: this.$data,
			...this.$data
		}
	}
})
export default class ConfigProvider extends Vue {
	public set(name: string, value: any) {
		this.$set(this.$data, name, value)

		if (name === 'lang') {
			document.body.classList.remove('en', 'ja')
			document.body.classList.add(value)
		}
	}

	private mounted() {
		document.body.classList.add(this.$data.lang)
	}
}
</script>

<style lang="stylus" scoped>
.ConfigProvider
	height 100%
</style>
