<template>
	<InputMode class="ParamFieldMode" v-bind="$props" v-on="$listeners"/>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputMode from './InputMode.vue'

type ValueType = string | number

@Component({
	components: {InputMode}
})
export default class ParamFieldMode extends Vue {
	@Prop([String, Number]) private value!: ValueType
	@Prop(Array) private values!: ValueType[]
	@Prop(Array) private labels!: string[]
}
</script>