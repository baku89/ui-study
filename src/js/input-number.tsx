import * as React from 'react'
import * as classNames from 'classnames'

import * as Gesture from './gesture'
import {calcPrecision} from './math-utils'
import {getDOMCenter} from './dom-utils'
import Point from './point'
import evalExpression from './eval-expression'

import SvgOverlay from './svg-overlay'
import {InputBaseProps} from './input-base'

interface Props extends InputBaseProps<number> {
	unit?: string,
	baseUnit?: string,
	altUnits?: object
	className?: string,
	onHover?: (hover: boolean) => void,
	onToggleDrag?: (dragging: boolean) => void
}

interface State {
	dragging: boolean,
	focusing: boolean,
	updating: boolean,
	inputValue: string,
	dragOrigin: Point,
	dragDest: Point
}

export default class InputNumber extends React.Component<Props, State> {

	static NumberRegex: RegExp = /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/
	
	private updateTimer: any
	private $static: HTMLElement
	private $input: HTMLInputElement
	private gesture: Gesture

	constructor(props:Props) {
		super(props)

		this.state = {
			dragging: false,
			focusing: false,
			updating: false,
			inputValue: props.value.toString(),
			dragOrigin: new Point,
			dragDest: new Point
		}
	}

	componentDidMount() {
		this.gesture = new Gesture(this.$static, this.$input)

		this.gesture.on('start-drag', this.handleStartDrag)
		this.gesture.onDrag(this.handleDrag)
		this.gesture.on('end-drag', this.handleEndDrag)
		this.gesture.on('click', this.handleClickStatic)
		this.gesture.on('increment', this.handleIncrement)
		this.gesture.on('blur', this.handleBlur)
	}

	componentDidUpdate(prevProps: Props, prevState: State) {
		if (this.state.focusing && !prevState.focusing) {
			this.$input.select()
		}
	}

	shouldComponentUpdate(nextProps: Props, nextState: State) {
		return nextProps.value != this.props.value
			|| nextState.updating != this.state.updating
			|| nextState.focusing != this.state.focusing
			|| nextState.inputValue != this.state.inputValue
			|| nextState.dragging
			|| (!nextState.dragging && this.state.dragging)
	}

	componentWillUnmount() {
		this.gesture.dispose()
	}

	componentWillReceiveProps(nextProps: Props) {

		const updating = nextProps.value != this.props.value

		if (updating) {
			clearTimeout(this.updateTimer)
			this.updateTimer = setTimeout(this.turnOffUpdateBlink, 100)
		}

		this.setState({
			inputValue: nextProps.value.toString(),
			updating
		})
	}

	turnOffUpdateBlink = () => {
		this.setState({updating: false})
	}

	handleStartDrag = (origin) => {
		if (this.props.onToggleDrag) this.props.onToggleDrag(true)

		this.setState({
			dragOrigin: new Point(origin.x, getDOMCenter(this.$input).y)
		})
	}

	handleDrag = ({multiplyMode, delta, current}: Gesture.DragEvent) => {
		if (this.state.focusing) return

		let inc = delta.x
		if (multiplyMode === Gesture.MultiplyMode.More) inc *= 10
		if (multiplyMode === Gesture.MultiplyMode.Less) inc *= 0.1

		const p:number = Math.max(1, calcPrecision(this.props.value))

		const value = parseFloat((this.props.value + inc).toFixed(p))
		this.props.onChange(value)

		this.setState({
			dragging: true,			
			dragDest: current
		})
	}

	handleEndDrag = () => {
		if (this.props.onToggleDrag) this.props.onToggleDrag(false)
		this.setState({dragging: false})
	}
	
	handleIncrement = (inc) => {
		const precision = calcPrecision(inc)
		const digits = Math.pow(10, precision)

		let newValue = this.props.value + inc
		newValue = Math.round(newValue * digits) / digits
		
		this.props.onChange(newValue)
	}

	handleChange = () => {
		this.setState({inputValue: this.$input.value})
	}

	handleBlur = () => {

		let text = this.$input.value.trim()
		let unitScale = 1
		let value

		// separate number and unit if exists
		for (let unit in this.props.altUnits) {
			if (text.endsWith(unit)) {
				unitScale = this.props.altUnits[unit]
				text = text.substr(0, text.length - unit.length).trim()
			}
		}

		if (InputNumber.NumberRegex.test(text)) {

			// pure number
			value = parseFloat(text) * unitScale

		} else {

			// expression
			if (text.length == 0) {
				value = 0
			} else {
				value = evalExpression(text, this.props.value) * unitScale
			}
		}

		this.props.onChange(isNaN(value) ? 0 : value)
		this.setState({focusing: false})
	}

	handleClickStatic = () => {
		if (this.state.dragging) return
		this.setState({focusing: true})
	}

	handleMouseEnterValue = () => {
		if (this.props.onHover)
			this.props.onHover(true)
	}

	handleMouseLeaveValue = () => {
		if (this.props.onHover)
			this.props.onHover(false)
	}

	render() {

		console.log('number render', Math.random()) 

		const {focusing, updating, dragging} = this.state
		
		const classes = classNames(
			'input',
			'input-number',
			{'focus': this.state.focusing},
			{'update': this.state.updating || this.state.dragging},
			this.props.className
		)

		const {dragOrigin, dragDest} = this.state

		return (
			<div className={classes}>
				<div
					className='input-number__value'
					onMouseEnter={this.handleMouseEnterValue}
					onMouseLeave={this.handleMouseLeaveValue}
				>

					<input className='input-number__input mousetrap'
						ref={el => this.$input = el}
						type='text'
						value={this.state.inputValue}
						tabIndex={0}
						onChange={this.handleChange}
						onBlur={this.handleBlur}
					/>

					<div className='input-number__static'
						ref={el => this.$static = el}>
						{this.props.value.toFixed(1)}
					</div>
				</div>

				{this.props.unit &&
					<div className='input__unit'>{this.props.unit}</div>
				}

				{this.state.dragging &&
					<SvgOverlay cursor='col-resize'>
						<use
							xlinkHref='#arrow'
							transform={`
								translate(${dragDest.x}, ${dragOrigin.y}) 
								scale(${dragDest.x - dragOrigin.x >= 0 ? 1 : -1}, 1)
							`}
						/>
						<line className='bold'
							x1={dragOrigin.x}
							y1={dragOrigin.y}
							x2={dragDest.x}
							y2={dragOrigin.y}
						/>
						<line className='dashed'
							x1={dragDest.x}
							y1={dragOrigin.y}
							x2={dragDest.x}
							y2={dragDest.y}
						/>
					</SvgOverlay>
				}
			</div>
		)
	}
}