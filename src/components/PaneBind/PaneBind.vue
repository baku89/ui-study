<template>
	<div class="PaneBind">
		<div class="PaneBind__header">
			<h3 class="PaneBind__title">BIND</h3>
			<InputIconAction
				class="PaneBind__add"
				:items="addMenuItems"
				src="./assets/icon_plus.svg"
				@click="addBind"
			/>
		</div>
		<div class="PaneBind__row" v-for="(bind, index) in schema.bindList" :key="index">
			<div class="PaneBind__row-header" @dblclick="removeBind(index)">
				<label class="PaneBind__method">{{bind.method[0].toUpperCase() + bind.method.substr(1)}}</label>
				<ParamFieldBind
					class="PaneBind__address"
					v-model="bind.address"
					:detectType="bind.method !== 'map' ? 'press' : 'change'"
					@input="$emit('update:schema', schema)"
				/>
			</div>
			<div class="PaneBind__option" v-if="/^(set|add)$/.test(bind.method)">
				<label class="PaneBind__option-label">Value</label>
				<component
					:is="'ParamField' + ui[0].toUpperCase() + ui.substr(1)"
					:compact="true"
					:precision="schema.precision"
					:min="bind.method === 'set' ? schema.min : undefined"
					:max="bind.method === 'set' ? schema.max : undefined"
					:step="schema.step"
					:unit="schema.unit"
					:showSign="bind.method === 'add'"
					class="PaneBind__option-value"
					v-model="bind.option.value"
					@input="$emit('update:schema', schema);"
				/>
			</div>
			<template v-else-if="bind.method === 'map'">
				<div class="PaneBind__option">
					<label class="PaneBind__option-label">From</label>
					<ParamFieldVector
						class="PaneBind__option-value"
						v-model="bind.option.from"
						@input="$emit('update:schema', schema)"
					/>
				</div>
				<div class="PaneBind__option">
					<label class="PaneBind__option-label">To</label>
					<ParamFieldVector
						class="PaneBind__option-value"
						v-model="bind.option.to"
						@input="$emit('update:schema', schema)"
					/>
				</div>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import InputIconAction from '../InputIconAction'
import ParamFieldBind from '../ParamFieldBind.vue'
import ParamFieldCheckbox from '../ParamFieldCheckbox.vue'
import ParamFieldColor from '../ParamFieldColor.vue'
import ParamFieldNumber from '../ParamFieldNumber.vue'
import ParamFieldString from '../ParamFieldString.vue'
import ParamFieldVector from '../ParamFieldVector.vue'
import {Schema, BindSchema} from '../../data/Schema'

@Component({
	components: {
		ParamFieldBind,
		ParamFieldCheckbox,
		ParamFieldColor,
		ParamFieldNumber,
		ParamFieldString,
		ParamFieldVector,
		InputIconAction
	}
})
export default class PaneBind extends Vue {
	@Prop({type: [Number, String, Boolean, Array, Object], required: true})
	private value!: any
	@Prop({type: Object, required: true}) private schema!: Schema

	private created() {
		console.log(this.schema)
	}

	private get ui(): string {
		const {ui} = this.schema
		if (ui === 'slider' || ui === 'number') {
			return 'number'
		} else if (ui === 'point' || ui === 'scale') {
			return 'vector'
		} else {
			return ui
		}
	}

	private get addMenuItems(): any[] {
		const items = [{value: 'set', label: 'Set'}]

		if (/^(number|vector)$/.test(this.ui)) {
			items.push({value: 'add', label: 'Add'})
		}

		if (this.ui === 'number') {
			items.push({value: 'map', label: 'Map'})
		}

		return items
	}

	private updateAddress(bind: any, address: string) {
		bind.address = address
		this.$emit('update:schema', this.schema)
	}

	private addBind(method: string) {
		let bind: BindSchema | null = null
		const {schema} = this

		if (method === 'set') {
			bind = {method, address: '', option: {value: this.value}}
		} else if (method === 'add') {
			bind = {
				method,
				address: '',
				option: {value: this.ui === 'vector' ? [1, 1] : 1}
			}
		} else if (method === 'map') {
			const to = [0, 1]

			if (schema.min && typeof schema.min === 'number') {
				to[0] = schema.min
			}
			if (schema.max && typeof schema.max === 'number') {
				to[1] = schema.max
			}
			bind = {method, address: '/MIDI/', option: {from: [0, 127], to}}
		}

		if (bind) {
			if (!schema.bindList) {
				this.$set(schema, 'bindList', [])
			}
			schema.bindList!.push(bind)
			this.$emit('update:schema', schema)
		}
	}

	private removeBind(index: number) {
		const {bindList} = this.schema
		bindList!.splice(index, 1)
		this.$emit('update:schema', this.schema)
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

.PaneBind
	padding var(--layout-popover-padding)
	width 16em
	// border 1px solid var(--color-border-text)
	border-radius $border-radius
	box-shadow 0 0 1.5em 0 rgba(black, 0.2)
	user-select none
	enable-menu-color()

	&:before
		position absolute
		top 0
		left 50%
		display block
		width 0
		height 0
		border-width $popover-arrow-size
		border-style solid
		border-color transparent
		content ''

	&[x-placement=^bottom]
		margin-top $popover-arrow-size

		&:before
			margin-top -1 * $popover-arrow-size
			margin-left -1 * $popover-arrow-size
			border-top-width 0
			border-bottom-color var(--color-bg)

	&__header
		display flex
		padding-left 0.2em
		height var(--layout-input-height)

	&__title
		flex-grow 1
		height calc((var(--layout-input-height) / 1.2))
		color #838383
		letter-spacing 0.2em
		font-size 1.2em
		line-height calc((var(--layout-input-height) / 1.2))

	&__row
		padding 0 0.3em

	&__row-header
		display flex
		padding calc(0.5 * (var(--layout-param-height) - var(--layout-input-height))) 0
		color var(--color-text)
		line-height var(--layout-input-height)

	&__method
		flex-grow 1

	&__address
		margin-right 0
		width 10em

	&__option
		display flex
		margin-left 0.2em
		padding-bottom calc(0.5 * (var(--layout-param-height) - var(--layout-input-height)))
		padding-left 0.8em
		border-left 1px solid var(--color-border)
		color var(--color-text)
		line-height var(--layout-input-height)

		&-label
			flex-grow 1
			color #838383

		&-value
			justify-content flex-end
			margin-right 0
			width 6em
</style>
