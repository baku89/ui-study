<template>
	<SelectionManager>
		<div class="Settings ui">
			<ParameterList v-model="Config" :defaults="[ConfigDefault]" :schema="ConfigSchema" width="14em"/>
		</div>
	</SelectionManager>
</template>

<script lang="ts">
import {Component, Prop, Vue, Inject, Watch} from 'vue-property-decorator'

import {ConfigSchema, ConfigDefault} from '../core/config'
import components from '../components'

@Component({components})
export default class Settings extends Vue {
	@Inject({from: 'Config'}) private Config!: any

	private ConfigSchema = ConfigSchema
	private ConfigDefault = ConfigDefault
}
</script>

<style lang="stylus" scoped></style>

