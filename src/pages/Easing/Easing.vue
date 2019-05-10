<template>
	<SelectionManager>
		<div class="page-content article">
			<h2>Example</h2>
			<div class="ui">
				<div class="param">
					<ParameterList v-model="ex" :defaultSchema="exSchema" :schema.sync="exUserSchema"/>
				</div>
			</div>
		</div>
	</SelectionManager>
</template>


<script lang="ts">
import {Component, Vue, Watch, Inject} from 'vue-property-decorator'

import Components from '../../components'

@Component({
	components: Components
})
export default class Easing extends Vue {
	private ex = {
		radius: 25
	}

	private exSchema = {
		count: {
			ui: 'slider',
			min: 0,
			max: 50,
			step: 1
		},
		increment: {
			ui: 'button',
			onClick: this.onClickIncrement
		},
		__order: ['radius']
	}

	private exUserSchema = {}

	private onClickIncrement() {
		this.ex.radius += 1
	}
}
</script>

<style lang="stylus" scoped>
@import '../../style/config.styl'
</style>
