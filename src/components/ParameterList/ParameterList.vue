<template>
	<div class="ParameterList" :style="rootStyles">
		<Parameter
			v-for="desc of descriptor"
			:key="desc.path"
			:value="getValue(desc)"
			:schema="desc.schema"
			@input="updateValue(desc, $event)"
			@update:schema="updateSchema(desc, $event)"
		>
			<component
				:is="toParamFieldComponent(desc)"
				@input="updateValue(desc, $event)"
				@change="pushHistory(desc, ...arguments)"
				v-bind="toParamFieldProps(desc)"
			/>
		</Parameter>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import Case from 'case'
import deepmerge from 'deepmerge'

import deepcopy from '../../util/deepcopy'
import {quantize, fit, toFixed} from '../../math'
import {constrainValue} from '../../util'
import {Store} from '../../data'
import {Schema, mergeSchema, SchemaGroup} from '../../data/Schema'
import BindManager from '../../manager/BindManager'
import HistoryManager from '../../manager/HistoryManager'

import Parameter from './Parameter.vue'
import ParamFieldAngle from '../ParamFieldAngle.vue'
import ParamFieldBind from '../ParamFieldBind.vue'
import ParamFieldCheckbox from '../ParamFieldCheckbox.vue'
import ParamFieldColor from '../ParamFieldColor.vue'
import ParamFieldDropdown from '../ParamFieldDropdown.vue'
import ParamFieldNumber from '../ParamFieldNumber.vue'
import ParamFieldMode from '../ParamFieldMode.vue'
import ParamFieldPoint from '../ParamFieldPoint.vue'
import ParamFieldRange from '../ParamFieldRange.vue'
import ParamFieldScale from '../ParamFieldScale.vue'
import ParamFieldSeed from '../ParamFieldSeed.vue'
import ParamFieldSlider from '../ParamFieldSlider.vue'
import ParamFieldString from '../ParamFieldString.vue'

interface ParameterDescriptor {
	schema: Schema
	parentStore: Store
	key: string
	path: string
}

interface Descriptor extends Array<ParameterDescriptor | Descriptor> {}

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
	@Prop({type: Object, required: true}) private value!: Store
	@Prop({type: Object, required: true}) private schema!: SchemaGroup
	@Prop({type: Array, default: () => []}) private defaultSchemas!: SchemaGroup[]
	@Prop({type: String, default: '4em'}) private width!: string

	private descriptor: any = []

	private boundEvents!: Array<{
		type: string
		callback: (...args: any[]) => void
	}>

	private created() {
		this.boundEvents = []
		this.generateDescriptor()
	}

	private mounted() {
		BindManager.on('press:/key/z', () => {
			HistoryManager.undo()
		})
		BindManager.on('press:/key/x', () => {
			HistoryManager.redo()
		})
	}

	private get rootStyles() {
		return {
			'--parameter-list-width': this.width
		}
	}

	private getValue(desc: ParameterDescriptor) {
		const value = desc.parentStore[desc.key]
		const {toField} = desc.schema
		return toField ? toField(value) : value
	}

	private toParamFieldComponent({schema: {ui}}: ParameterDescriptor): string {
		return 'ParamField' + ui[0].toUpperCase() + ui.substr(1)
	}

	private toParamFieldProps(desc: ParameterDescriptor): any {
		const props = desc.schema.getAttrs()

		delete props.ui
		delete props.label
		delete props.bindList

		const value = desc.parentStore[desc.key]

		const {toField} = desc.schema
		props.value = toField ? toField(value) : value

		return props
	}

	private updateValue(
		{parentStore, key, path, schema: {toData}}: ParameterDescriptor,
		value: any
	) {
		value = toData ? toData(value) : value
		this.$set(parentStore, key, value)
		this.$emit('input', this.value)
	}

	private pushHistory(
		{path, parentStore, key, schema: {toData}}: ParameterDescriptor,
		newValue: any,
		oldValue: any
	) {
		newValue = toData ? toData(newValue) : newValue
		oldValue = toData ? toData(oldValue) : oldValue
		console.log(
			'change',
			path,
			JSON.stringify(oldValue),
			'=>',
			JSON.stringify(newValue)
		)

		const undo = () => this.$set(parentStore, key, oldValue)
		const redo = () => this.$set(parentStore, key, newValue)
		const label = `${path}: ${JSON.stringify(oldValue)} => ${JSON.stringify(
			newValue
		)}`

		HistoryManager.addHistory({undo, redo, label})
	}

	private updateSchema(desc: ParameterDescriptor, schema: Schema) {
		const {path} = desc
		const paths = path.split('/').filter(name => !!name)
	}

	private traverseSchemaGroup(
		schemaGroup: SchemaGroup,
		store: Store,
		path: string
	): Descriptor {
		const descriptor: Descriptor = []

		for (const schema of schemaGroup.children) {
			const name = schema.name
			const childPath = `${path}/${name}`

			if (schema instanceof SchemaGroup) {
				const desc = this.traverseSchemaGroup(
					schema,
					store[name] as Store,
					childPath
				)
				Array.prototype.push.apply(descriptor, desc)
			} else {
				const desc: ParameterDescriptor = {
					parentStore: store,
					key: name,
					schema,
					path: childPath
				}
				descriptor.push(desc)
			}
		}

		return descriptor
	}

	private generateDescriptor() {
		const mergedSchema = mergeSchema([...this.defaultSchemas, this.schema])
		this.descriptor = this.traverseSchemaGroup(mergedSchema, this.value, '')
	}

	// private bindAll() {
	// 	// Reassign all callbacks registered previously
	// 	for (const {type, callback} of this.boundEvents) {
	// 		BindManager.off(type, callback)
	// 	}

	// 	// Traverse the descriptor
	// 	for (const def of this.descriptor) {
	// 		if (def.bindList) {
	// 			for (const {address, method, option} of def.bindList) {
	// 				if (!address || !address.includes('/')) {
	// 					continue
	// 				}

	// 				let type: null | string = null
	// 				let callback: null | ((...args: any[]) => void) = null

	// 				if (method === 'set') {
	// 					// Set
	// 					type = `press:${address}`
	// 					callback = () => {
	// 						this.updateValue(def, option.value)
	// 					}
	// 				} else if (method === 'add') {
	// 					// Inc
	// 					type = `press:${address}`
	// 					callback = () => {
	// 						let newValue = def._parentRef[def._key]
	// 						if (Array.isArray(newValue)) {
	// 							newValue = newValue.map((val, i) => val + option.value[i])
	// 						} else {
	// 							newValue += option.value
	// 						}
	// 						this.updateValue(def, newValue)
	// 					}
	// 				} else if (method === 'map') {
	// 					// Map
	// 					const {from, to} = option
	// 					type = `change:${address}`
	// 					callback = ({value}: {value: number}) => {
	// 						value = fit(value, from[0], from[1], to[0], to[1])
	// 						this.updateValue(def, value)
	// 					}
	// 				}

	// 				// Register callback to BindManager
	// 				if (type !== null && callback !== null) {
	// 					BindManager.on(type, callback)
	// 					this.boundEvents.push({type, callback})
	// 				}
	// 			}
	// 		}
	// 	}
	// }
}
</script>


<style lang="stylus" scoped>
// .ParameterList
// 	display table
// 	width 100%
</style>


