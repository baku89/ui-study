<script lang="ts">
import Vue from 'vue'
import InputNumber from './InputNumber'

export default Vue.extend({
	name: 'ParamFieldNumber',
	// @ts-ignore
	functional: true,
	render(h: any, context: any) {
		return h(InputNumber, {
			...context.data,
			class: 'ParamFieldNumber param-field--1w'
		})
	}
})
</script>