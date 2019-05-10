import deepmerge from 'deepmerge'
import Case from 'case'

import BaseNode from './BaseNode'
import IndexedNode from './IndexedNode'
import deepcopy from '../util/deepcopy'

function mergeSchemaPair(
	a: Schema | SchemaGroup,
	b: Schema | SchemaGroup
): Schema | SchemaGroup {
	if (a instanceof Schema && b instanceof Schema) {
		// If both objects are instances of Schema, just merge the attribute.
		return new Schema(b.name || a.name, deepmerge(a.getAttrs(), b.getAttrs()))
	} else if (a instanceof SchemaGroup && b instanceof SchemaGroup) {
		// If both objects are instances of SchemaGroup, merge the two array of children.
		// The way of merge is as same as how two objects are merged when using Object.assign({}, a, b)
		// The order of proerties of A will be saved and the properties that only B has will be appended after them.
		const out = new SchemaGroup(
			b.name || a.name,
			deepmerge(a.getAttrs(), b.getAttrs()),
			deepcopy(a.children)
		)

		for (const childOfB of b.children) {
			const {name} = childOfB
			const childOfA = out._namedChildren[name]

			if (childOfA) {
				// out.set(name, )
				const index = out.children.indexOf(childOfA)
				const newChild = mergeSchemaPair(childOfA, childOfB)
				out.children.splice(index, 1, newChild)
				out._namedChildren[name] = newChild
			} else {
				const newChild = childOfB.clone()
				out.children.push(newChild)
				out._namedChildren[name] = newChild
			}
		}
		return out
	} else {
		// If one is Schema and the other is SchemaGroup, merge would fail so trhow the error.
		throw new Error('Cannot merge because the types of two schema do not match')
	}
}

export function mergeSchema(schemas: SchemaGroup[]): SchemaGroup {
	const [car, ...cdr] = schemas
	return cdr.reduce(
		(prev, current) => mergeSchemaPair(prev, current),
		car
	) as SchemaGroup
}

export interface BindSchema {
	address: string
	method: string
	option: {[name: string]: any}
}

export interface ISchema {
	ui?: string
	label?: string
	prefix?: string
	unit?: string
	labels?: string[]
	values?: string[]
	precision?: number
	min?: number | number[]
	max?: number | number[]
	step?: number
	keepProportion?: boolean
	bindList?: BindSchema[]
	toField?: (v: any) => any
	toData?: (v: any) => any
}

export class Schema extends BaseNode implements ISchema {
	public name!: string

	public ui!: string
	public label?: string
	public prefix?: string
	public unit?: string
	public labels?: string[]
	public values?: string[]
	public precision?: number
	public min?: number | number[]
	public max?: number | number[]
	public step?: number
	public keepProportion?: boolean
	public bindList?: BindSchema[]
	public toField?: (v: any) => any
	public toData?: (v: any) => any

	constructor(name: string, schemaObj: ISchema) {
		super(name, schemaObj)

		if (!schemaObj.label) {
			this.label = Case.capital(name)
		}
	}

	public clone(): Schema {
		return super.clone() as Schema
	}
}

export class SchemaGroup extends IndexedNode {
	public name!: string
	public label!: string
	public children!: Array<Schema | SchemaGroup>
	public _namedChildren!: {[s: string]: Schema | SchemaGroup}

	constructor(
		name: string,
		schemaObj: {label?: string},
		children: Array<Schema | SchemaGroup>
	) {
		super(name, schemaObj, children)

		if (!schemaObj || !schemaObj.label) {
			this.label = Case.capital(name)
		}
	}

	public clone(): SchemaGroup {
		return super.clone() as SchemaGroup
	}
}

export const p = (name: string, schemaObj: ISchema) =>
	new Schema(name, schemaObj)

export const g = (
	name: string,
	schemaObj: any,
	children: Array<Schema | SchemaGroup>
) => new SchemaGroup(name, schemaObj, children)
