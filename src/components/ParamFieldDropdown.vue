<template>
	<InputDropdown class="ParamFieldDropdown param-field--1w" v-bind="$props" v-on="$listeners"/>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputDropdown from './InputDropdown.vue'

type ValueType = string | number

@Component({
	components: {InputDropdown}
})
export default class ParamFieldDropdown extends Vue {
	@Prop([String, Number]) private value!: ValueType
	@Prop(Array) private values!: ValueType[]
	@Prop(Array) private labels!: string[]
	@Prop(String) private theme!: string
}
</script>