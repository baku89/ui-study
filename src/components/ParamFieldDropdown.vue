<script lang="ts">
import Vue from 'vue'
import InputDropdown from './InputDropdown'

export default Vue.extend({
	name: 'ParamFieldDropdown',
	// @ts-ignore
	functional: true,
	render(h: any, context: any) {
		return h(InputDropdown, {
			...context.data,
			class: 'ParamFieldDropdown param-field--1w'
		})
	}
})
</script>
</script>

