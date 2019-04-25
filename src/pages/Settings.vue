<template>
	<SelectionManager>
		<div class="Settings ui">
			<ParameterList v-model="Config" :schema="SchemaConfig" width="14em"/>
		</div>
	</SelectionManager>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'

import {DataConfig, SchemaConfig} from '../core'
import components from '../components'
import {DataColor} from '../data'
import {convertColorElements} from '../util'

@Component({components})
export default class Settings extends Vue {
	@Inject({from: 'Config'}) private Config!: DataConfig

	private SchemaConfig = SchemaConfig
}
</script>

<style lang="stylus" scoped></style>

