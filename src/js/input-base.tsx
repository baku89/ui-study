export interface InputBaseProps<T> {
	value: T,
	onChange: (value: T) => void
}

export interface InputBaseUnitProps<T> extends InputBaseProps<T> {
	unit?: string
}

export interface InputBaseState {
	hovering: boolean
}