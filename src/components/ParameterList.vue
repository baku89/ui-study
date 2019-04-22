<template>
	<div class="ParameterList">
		<Parameter
			v-for="def of parsedDefinition"
			:key="def.path"
			:label="def.label"
			:default="def.default"
			:width="width"
			@input="setValue(def, $event)"
		>
			<component
				:is="'ParamField' + def.type[0].toUpperCase() + def.type.substr(1, def.type.length - 1)"
				:value="getValue(def)"
				@input="setValue(def, $event)"
				v-bind="{...def, label: undefined}"
			/>
		</Parameter>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import Case from 'case'

import Parameter from './Parameter.vue'
import ParamFieldDropdown from './ParamFieldDropdown.vue'
import ParamFieldNumber from './ParamFieldNumber.vue'
import ParamFieldString from './ParamFieldString.vue'
import ParamFieldSlider from './ParamFieldSlider.vue'
import ParamFieldColor from './ParamFieldColor.vue'
import deepcopy from 'deepcopy'

@Component({
	components: {
		Parameter,
		ParamFieldDropdown,
		ParamFieldNumber,
		ParamFieldString,
		ParamFieldSlider,
		ParamFieldColor
	}
})
export default class ParameterList extends Vue {
	@Prop({type: Object, required: true}) private value!: any
	@Prop({type: Object, required: true}) private definition!: any
	@Prop(String) private width!: string

	private get parsedDefinition(): any {
		return this.parseDefinition(this.value, this.definition)
	}

	private getValue(def: any): any {
		const value = def.path
			.split('.')
			.reduce((v: any, key: string) => v[key], this.value)
		return def.toField ? def.toField(value) : value
	}

	private setValue(def: any, value: any) {
		const pathParent = def.path.split('.')
		const key = pathParent[pathParent.length - 1]
		pathParent.pop()

		const dataParent = pathParent.reduce(
			(v: any, key: string) => v[key],
			this.value
		)

		value = def.toData ? def.toData(value) : value
		this.$set(dataParent, key, value)
	}

	private parseDefinition(value: any, definition: any): any[] {
		const parsed = Object.keys(value)
			.map((key: string) => {
				let def: {[s: string]: any} | null = null

				if (definition[key] !== undefined) {
					// If exists
					def = definition[key]
				} else {
					if (definition[`group:${key}`]) {
						// If it is a group
						def = this.parseDefinition(value[key], definition[`group:${key}`])
						for (const d of def as any[]) {
							d.path = `${key}.${d.path}`
						}
					} else if (definition._regex) {
						// Regex
						for (const pattern of Object.keys(definition._regex)) {
							if (new RegExp(pattern).test(key)) {
								def = deepcopy(definition._regex[pattern])
								break
							}
						}
					}
				}
				if (def !== null) {
					def.path = key

					if (def.label === undefined) {
						def.label = Case.capital(key)
					} else if (typeof def.label === 'function') {
						def.label = def.label(key)
					}
				}
				return def
			})
			.filter(def => def !== null)
			.map(def => (def instanceof Array ? def : [def]))

		return Array.prototype.concat.apply([], parsed)
	}

	private defaultDefinition(key: string, value: any): any {
		const typeOfValue = typeof value

		if (/^(number|string)$/.test(typeOfValue)) {
			return {type: typeOfValue}
		} else {
			return null
		}
	}
}
</script>


<style lang="stylus" scoped>
// .ParameterList
// 	display table
// 	width 100%
</style>


