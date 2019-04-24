<template>
	<InputCheckbox class="ParamFieldCheckbox" v-bind="$props" v-on="$listeners"/>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputCheckbox from './InputCheckbox.vue'

@Component({
	components: {InputCheckbox}
})
export default class ParamFieldCheckbox extends Vue {
	@Prop({type: Boolean, required: true}) private value!: number
	@Prop(String) private label!: string
}
</script>