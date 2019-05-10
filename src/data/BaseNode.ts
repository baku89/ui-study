import deepcopy from '../util/deepcopy'

export default class BaseNode {
	public name!: string | null
	public _parent!: BaseNode | null

	constructor(
		name: string | null = null,
		attrs: {[s: string]: any} | null = null
	) {
		this.name = name

		Object.defineProperties(this, {
			_parent: {
				writable: true,
				enumerable: false
			}
		})

		if (attrs) {
			this.setAttrs(attrs)
		}
	}

	public clone(): BaseNode {
		return new BaseNode(this.name, deepcopy(this.getAttrs()))
	}

	public getAttrs(): {[s: string]: any} {
		const attrs = Object.assign({}, this)
		delete attrs.name
		return attrs
	}

	public setAttrs(attrs: {[s: string]: any}) {
		const self = this as {[s: string]: any}
		for (const key of Object.keys(attrs)) {
			self[key] = attrs[key]
		}
	}

	public serialize() {
		const attrs = this.getAttrs()

		const obj: any[] = ['']

		const className = this.constructor.name
		if (className !== 'IndexedNode') {
			obj[0] += `:${className}`
		}

		if (this.name) {
			obj[0] += `#${this.name}`
		}

		if (Object.keys(attrs).length > 0) {
			obj.push(attrs)
		}

		return obj
	}

	public toJSON() {
		return this.serialize()
	}
}
