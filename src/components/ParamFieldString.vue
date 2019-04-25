<script lang="ts">
import Vue from 'vue'
import InputString from './InputString.vue'

export default Vue.extend({
	name: 'ParamFieldString',
	// @ts-ignore
	functional: true,
	render(h: any, context: any) {
		return h(InputString, {
			...context.data,
			class: 'ParamFieldString param-field--2w'
		})
	}
})
</script>