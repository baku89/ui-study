<script lang="ts">
import Vue from 'vue'
import InputMode from './InputMode.vue'

export default Vue.extend({
	name: 'ParamFieldMode',
	// @ts-ignore
	functional: true,
	render(h: any, context: any) {
		return h(InputMode, {
			...context.data,
			class: 'ParamFieldMode'
		})
	}
})
</script>