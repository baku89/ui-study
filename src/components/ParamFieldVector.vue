<script lang="ts">
import Vue from 'vue'
import InputVector from './InputVector.vue'

export default Vue.extend({
	name: 'ParamFieldVector',
	// @ts-ignore
	functional: true,
	render(h: any, context: any) {
		return h(InputVector, {
			...context.data,
			class: 'ParamFieldVector param-field--2w'
		})
	}
})
</script>