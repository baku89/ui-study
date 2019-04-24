<template>
	<div class="ParamFieldString param-field--2w">
		<InputString v-bind="$props" v-on="$listeners"/>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputString from './InputString.vue'

@Component({
	components: {InputString}
})
export default class ParamFieldString extends Vue {
	@Prop({type: String, required: true}) private value!: string
	@Prop(Function) private validator!: (value: string) => string | false
}
</script>