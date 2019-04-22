<template>
	<InputNumber class="ParamFieldNumber param-field--1w" v-bind="$props" v-on="$listeners"/>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputNumber from './InputNumber.vue'

@Component({
	components: {InputNumber}
})
export default class ParamFieldNumber extends Vue {
	@Prop({type: Number, required: true}) private value!: number
	@Prop({type: Number, default: 1}) private precision!: number
	@Prop(String) private label!: string
	@Prop(String) private unit!: string
	@Prop(Number) private min!: number
	@Prop(Number) private max!: number
	@Prop(Number) private step!: number
}
</script>