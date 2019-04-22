<template>
	<SelectionManager>
		<div class="Settings ui">
			<ParameterList :value="Config" :definition="DefinitionConfig" width="14em"/>
		</div>
	</SelectionManager>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'

import {DataConfig, DefinitionConfig} from '../core'
import components from '../components'
import {DataColor} from '../data'
import {convertColorElements} from '../util'

@Component({components})
export default class Settings extends Vue {
	@Inject({from: 'Config'}) private Config!: DataConfig

	private DefinitionConfig = DefinitionConfig
}
</script>

<style lang="stylus" scoped></style>

