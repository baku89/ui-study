import {observable, reaction} from 'mobx'
import BaseNode from './BaseNode'
import deepcopy from '../util/deepcopy'

export default class IndexedNode extends BaseNode {
	public children!: BaseNode[]
	public _namedChildren!: {[s: string]: BaseNode}

	constructor(
		name: string | null = null,
		attrs: {[s: string]: any} | null = null,
		children: BaseNode[] = []
	) {
		super(name, attrs)
		this.children = children

		Object.defineProperties(this, {
			_parent: {
				writable: true,
				enumerable: false
			},
			_namedChildren: {
				enumerable: false,
				value: {}
			}
		})

		for (const child of this.children) {
			child._parent = this
			if (child.name) {
				this._namedChildren[child.name] = child
			}
		}
	}

	public clone(): IndexedNode {
		return new IndexedNode(
			this.name,
			deepcopy(this.getAttrs()),
			deepcopy(this.children)
		)
	}

	public getAttrs(): {[s: string]: any} {
		const attrs = super.getAttrs()
		delete attrs.children
		return attrs
	}

	public serialize() {
		const obj = super.serialize()

		if (this.children.length > 0) {
			obj.push(Array.from(this.children))
		}

		return obj
	}
}
