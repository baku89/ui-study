<template>
	<InputNumber class="ParamFieldNumber param-field--1w" v-bind="$props" v-on="$listeners"/>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputNumber from './InputNumber.vue'

@Component({
	components: {InputNumber}
})
export default class ParamFieldNumber extends Vue {}
</script>