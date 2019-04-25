<script lang="ts">
import Vue from 'vue'
import InputCheckbox from './InputCheckbox.vue'

export default Vue.extend({
	name: 'ParamFieldCheckbox',
	// @ts-ignore
	functional: true,
	render(h: any, context: any) {
		return h(InputCheckbox, {
			...context.data,
			class: 'ParamFieldCheckbox'
		})
	}
})
</script>