<template>
	<div class="ParameterList">
		<Parameter
			v-for="def of definition"
			:key="def.path"
			v-bind="toParameterProps(def)"
			@input="updateValue(def, $event)"
			@update:bindList="updateBindList(def, $event)"
		>
			<component
				:is="toParamFieldComponent(def.ui)"
				@input="updateValue(def, $event)"
				v-bind="toParamFieldProps(def)"
			/>
		</Parameter>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import Case from 'case'
import deepmerge from 'deepmerge'

import deepcopy from '../util/deepcopy'

import Parameter from './Parameter.vue'
import ParamFieldAngle from './ParamFieldAngle.vue'
import ParamFieldBind from './ParamFieldBind.vue'
import ParamFieldCheckbox from './ParamFieldCheckbox.vue'
import ParamFieldColor from './ParamFieldColor.vue'
import ParamFieldDropdown from './ParamFieldDropdown.vue'
import ParamFieldNumber from './ParamFieldNumber.vue'
import ParamFieldMode from './ParamFieldMode.vue'
import ParamFieldPoint from './ParamFieldPoint.vue'
import ParamFieldRange from './ParamFieldRange.vue'
import ParamFieldScale from './ParamFieldScale.vue'
import ParamFieldSeed from './ParamFieldSeed.vue'
import ParamFieldSlider from './ParamFieldSlider.vue'
import ParamFieldString from './ParamFieldString.vue'
import BindManager from '../core/BindManager'
import {quantize, fit} from '../math'

@Component({
	components: {
		Parameter,
		ParamFieldAngle,
		ParamFieldBind,
		ParamFieldCheckbox,
		ParamFieldColor,
		ParamFieldDropdown,
		ParamFieldNumber,
		ParamFieldMode,
		ParamFieldPoint,
		ParamFieldRange,
		ParamFieldScale,
		ParamFieldSeed,
		ParamFieldSlider,
		ParamFieldString
	}
})
export default class ParameterList extends Vue {
	@Prop({type: Object, required: true}) private value!: any
	@Prop({
		type: [Object, Array],
		default() {
			return {}
		}
	})
	private defaultSchema!: any
	@Prop({type: Object, required: true}) private schema!: any
	@Prop({type: String, default: ''}) private rootPath!: string
	@Prop(String) private width!: string

	private definition: any = []

	private boundEvents!: Array<{
		type: string
		callback: (...args: any[]) => void
	}>

	private created() {
		this.boundEvents = []

		this.parseAndBindSchema()
	}

	@Watch('defaultSchema')
	private onDefaultSchemaChanged() {
		// console.log('defaultSchema changed')
		this.parseAndBindSchema()
	}

	@Watch('schema')
	private onSchemChanged() {
		// console.log('schema changed')
		this.parseAndBindSchema()
	}

	private getValue(def: any): any {
		const value = def.path
			.split('/')
			.filter((p: any) => !!p)
			.reduce((v: any, key: string) => v[key], this.value)
		return def.toField ? def.toField(value) : value
	}

	private toParamFieldComponent(ui: string): string {
		return 'ParamField' + ui[0].toUpperCase() + ui.substr(1)
	}

	private toParamFieldProps(def: any): any {
		const props = {...def, value: this.getValue(def)}

		delete props.path
		delete props.ui
		delete props.label
		delete props.bindList

		for (const key of Object.keys(props)) {
			if (props[key] === undefined) {
				delete props[key]
			}
		}

		return props
	}

	private toParameterProps(def: any): any {
		const props = {
			value: this.getValue(def),
			label: def.label,
			default: def.default,
			min: def.min,
			max: def.max,
			step: def.step,
			precision: def.precision,
			unit: def.unit,
			width: this.width,
			bindList: def.bindList
		}

		return props
	}

	private updateValue(def: any, value: any) {
		const pathParent = def.path.split('/').filter((p: any) => !!p)
		const key = pathParent[pathParent.length - 1]
		pathParent.pop()

		const dataParent = pathParent.reduce(
			(v: any, k: string) => v[k],
			this.value
		)

		if (def.min !== undefined) {
			if (Array.isArray(value)) {
				const min = Array.isArray(def.min)
					? def.min
					: Array(value.length).fill(def.min)
				value = value.map((v: number, i: number) => Math.max(v, min[i]))
			} else {
				value = Math.max(value, def.min)
			}
		}

		if (def.max !== undefined) {
			if (Array.isArray(value)) {
				const max = Array.isArray(def.max)
					? def.max
					: Array(value.length).fill(def.max)
				value = value.map((v: number, i: number) => Math.min(v, max[i]))
			} else {
				value = Math.min(value, def.max)
			}
		}

		if (def.step !== undefined) {
			if (Array.isArray(value)) {
				const step = Array.isArray(def.step)
					? def.step
					: Array(value.length).fill(def.step)
				value = value.map((v: number, i: number) => quantize(v, step[i]))
			} else {
				value = quantize(value, def.step)
			}
		}

		value = def.toData ? def.toData(value) : value

		this.$set(dataParent, key, value)
		this.$emit('input', this.value)
	}

	private updateBindList(def: any, bindList: any) {
		this.bindAll()
		this.$set(def, 'bindList', bindList)
		this.$emit('update:schema', this.schema)
	}

	private parseAndBindSchema(): any {
		const defaultSchema = Array.isArray(this.defaultSchema)
			? this.defaultSchema
			: [this.defaultSchema]

		const schemas = [defaultSchema, [this.schema]].flat()

		const mergedSchema = schemas.reduce(
			(prev, current) => deepmerge(prev, current),
			{}
		)

		function parse(value: any, schema: any, path?: string): any[] {
			const parsed = Object.keys(value)
				.map((key: string) => {
					const currentPath = path !== undefined ? `${path}/${key}` : key
					let def: {[s: string]: any} | null = {}

					if (schema[key] !== undefined && schema[key].__type === 'group') {
						// If it is a group
						def = parse(value[key], schema[key], currentPath)
					} else {
						// If exact schema exists
						if (schema[key] !== undefined) {
							def = schema[key]
						}
						// Merge with regex
						if (schema.__regex) {
							for (const pattern of Object.keys(schema.__regex)) {
								if (new RegExp(pattern).test(key)) {
									def = {...deepcopy(schema.__regex[pattern]), ...def}
									break
								}
							}
						}
					}

					if (def !== null) {
						def.path = currentPath

						if (def.label === undefined) {
							def.label = Case.capital(key)
						} else if (typeof def.label === 'function') {
							def.label = def.label(key)
						}
					}
					return def
				})
				.filter(def => def !== null)
				.flat()

			return parsed
		}

		this.definition = parse(this.value, mergedSchema, this.rootPath)
		this.bindAll()
	}

	private bindAll() {
		// console.log('bindAll')

		// Reassign all callbacks registered previously
		for (const {type, callback} of this.boundEvents) {
			BindManager.off(type, callback)
		}

		// Traverse the definition
		for (const def of this.definition) {
			if (def.bindList) {
				for (const {address, method, option} of def.bindList) {
					if (!address || !address.includes('/')) {
						continue
					}

					let type: null | string = null
					let callback: null | ((...args: any[]) => void) = null

					if (method === 'set') {
						// Set
						type = `press:${address}`
						callback = () => {
							console.log('callback')
							this.updateValue(def, option.vƒalue)
						}
					} else if (method === 'add') {
						// Inc
						type = `press:${address}`
						callback = () => {
							let newValue = this.getValue(def)
							if (Array.isArray(newValue)) {
								newValue = newValue.map((val, i) => val + option.value[i])
							} else {
								newValue += option.value
							}
							this.updateValue(def, newValue)
						}
					} else if (method === 'map') {
						// Map
						const {from, to} = option
						type = `change:${address}`
						callback = ({value}: {value: number}) => {
							value = fit(value, from[0], from[1], to[0], to[1])
							this.updateValue(def, value)
						}
					}

					// Register callback to BindManager
					if (type !== null && callback !== null) {
						BindManager.on(type, callback)
						this.boundEvents.push({type, callback})
					}
				}
			}
		}
	}

	// private defaultSchema(key: string, value: any): any {
	// 	const typeOfValue = typeof value
	// 	if (/^(number|string)$/.test(typeOfValue)) {
	// 		return {type: typeOfValue}
	// 	} else {
	// 		return null
	// 	}
	// }
}
</script>


<style lang="stylus" scoped>
// .ParameterList
// 	display table
// 	width 100%
</style>


