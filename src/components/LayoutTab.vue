<template>
	<div class="LayoutTab" v-on="$listeners">
		<slot/>
	</div>
</template>


<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'
import uid from 'uid'

@Component({})
export default class LayoutTab extends Vue {
	@Prop({type: String, default: () => uid(10)}) private id!: string
	@Prop(String) private label!: string

	@Inject({from: 'Tabs'}) private Tabs!: {activeTab: number; items: any[]}

	private mounted() {
		this.setTabData()
	}

	private setTabData() {
		console.log('setTabData')
		this.$set(this.Tabs.items, this.id, {
			label: this.label
		})
	}
}
</script>

<style lang="stylus" scoped>
.LayoutTab
	position relative
	flex 1 0 100%
	width 100%
</style>


