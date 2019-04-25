<template>
	<Popover :active="active" @update:active="$emit('update:active', $event)">
		<div class="PopoverBind__root">
			<div class="PopoverBind__header">
				<h3 class="PopoverBind__title">BIND</h3>
				<InputIconAction
					class="PopoverBind__add"
					:items="addItems"
					src="./assets/icon_plus.svg"
					@click="addBind"
				/>
			</div>
			<div class="PopoverBind__row" v-for="(bind, index) in bindList" :key="index">
				<div class="PopoverBind__row-header">
					<label class="PopoverBind__method">{{bind.method[0].toUpperCase() + bind.method.substr(1)}}</label>
					<ParamFieldBind
						class="PopoverBind__address"
						:value="bind.address"
						@input="onAddressUpdate(index, bind, $event)"
					/>
				</div>
				<div class="PopoverBind__option" v-if="/^(set|add)$/.test(bind.method)">
					<label class="PopoverBind__option-label">Value</label>
					<component
						:is="'ParamField' + ui[0].toUpperCase() + ui.substr(1)"
						:compact="true"
						:precision="precision"
						:min="bind.method === 'set' ? min : undefined"
						:max="bind.method === 'set' ? max : undefined"
						:step="step"
						:unit="unit"
						class="PopoverBind__option-value"
						v-model="bind.option.value"
						@input="$emit('update:bindList')"
					/>
				</div>
				<template v-else-if="bind.method === 'map'">
					<div class="PopoverBind__option">
						<label class="PopoverBind__option-label">From</label>
						<ParamFieldVector
							class="PopoverBind__option-value"
							v-model="bind.option.from"
							@input="$emit('update:bindList')"
						/>
					</div>
					<div class="PopoverBind__option">
						<label class="PopoverBind__option-label">To</label>
						<ParamFieldVector
							class="PopoverBind__option-value"
							v-model="bind.option.to"
							@input="$emit('update:bindList')"
						/>
					</div>
				</template>
			</div>
		</div>
	</Popover>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

import Popover from '../common/Popover.vue'
import InputIconAction from '../InputIconAction'
import ParamFieldBind from '../ParamFieldBind.vue'
import ParamFieldCheckbox from '../ParamFieldCheckbox.vue'
import ParamFieldColor from '../ParamFieldColor.vue'
import ParamFieldNumber from '../ParamFieldNumber.vue'
import ParamFieldString from '../ParamFieldString.vue'
import ParamFieldVector from '../ParamFieldVector.vue'

@Component({
	components: {
		ParamFieldBind,
		ParamFieldCheckbox,
		ParamFieldColor,
		ParamFieldNumber,
		ParamFieldString,
		ParamFieldVector,
		Popover,
		InputIconAction
	}
})
export default class PopoverBind extends Vue {
	@Prop({type: Boolean, required: true}) private active!: boolean
	@Prop({type: String, required: true}) private ui!:
		| 'number'
		| 'color'
		| 'string'
		| 'vector'
		| 'checkbox'
	@Prop({type: [Number, String, Boolean, Array], required: true})
	private value!: any
	@Prop({type: Array, required: true}) private bindList!: any
	@Prop(Number) private precision!: number
	@Prop([Number, Array]) private min!: number | number[]
	@Prop([Number, Array]) private max!: number | number[]
	@Prop([Number, Array]) private step!: number | number[]
	@Prop(String) private unit!: string

	private get addItems(): any[] {
		const items = [{value: 'set', label: 'Set'}]

		if (/^(number|vector)$/.test(this.ui)) {
			items.push({value: 'add', label: 'Add'})
		}

		if (this.ui === 'number') {
			items.push({value: 'map', label: 'Map'})
		}

		return items
	}

	private onAddressUpdate(index: number, bind: any, address: string) {
		this.$set(this.bindList, index, {...bind, address})
		this.$emit('update:bindList', this.bindList)
	}

	private addBind(method: string) {
		let bind

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

			if (this.min && typeof this.min === 'number') {
				to[0] = this.min
			}
			if (this.max && typeof this.max === 'number') {
				to[1] = this.max
			}
			bind = {method, address: '/MIDI/', option: {from: [0, 127], to}}
		}

		if (bind) {
			this.bindList.push(bind)
			this.$emit('update:bindList', this.bindList)
		}
	}
}
</script>


<style lang="stylus" scoped>
@import '../../style/config.styl'

.PopoverBind
	user-select none

	&__root
		position fixed
		top 50%
		left 50%
		padding var(--layout-popover-padding)
		width 16em
		// border 1px solid var(--color-border-text)
		border-radius $border-radius
		box-shadow 0 0 1.5em 0 rgba(black, 0.2)
		enable-menu-color()

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
		// padding-top calc(0.5 * (var(--layout-param-height) - var(--layout-input-height)))
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
