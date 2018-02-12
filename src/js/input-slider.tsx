import * as React from 'react'
import * as classNames from 'classnames'
import * as clamp from 'clamp'
import * as mezr from 'mezr'

import {percentage, fit01} from './math-utils'
import * as Gesture from './gesture'
import Point from './point'
import {InputBaseUnitProps, InputBaseState} from './input-base'

import InputNumber from './input-number'

interface Props extends InputBaseUnitProps<number> {
	min: number,
	max: number
}

interface State extends InputBaseState {
	dragging: boolean
}

export default class InputSlider extends React.Component<Props, State> {

	gesture: Gesture
	$slider: HTMLElement	

	constructor(props) {
		super(props)

		this.state = {
			hovering: false,
			dragging: false
		}
	}

	componentDidMount() {
		this.gesture = new Gesture(this.$slider)

		this.gesture.on('drag', ({current}) => {
			this.handeDragSlider(current.x)
		})

		this.$slider.addEventListener('mousedown', (e: MouseEvent) => {
			this.handeDragSlider(e.pageX)
			this.setState({dragging: true})
		})
		
		this.gesture.on('end-drag', () => {
			this.setState({dragging: false})
		})
	}

	handeDragSlider(pageX:number) {
		const left = mezr.offset(this.$slider).left
		const width = mezr.width(this.$slider)

		const t = clamp((pageX - left) / width, 0, 1)
		const newValue = Math.floor(fit01(t, this.props.min, this.props.max) * 10) / 10

		this.props.onChange(newValue)
	}

	handleChange = (value) => {
		value = clamp(value, this.props.min, this.props.max)
		this.props.onChange(value)
	}

	handleHoverSlider = (hovering) => {
		this.setState({hovering})
	}

	render() {

		const {value, min, max} = this.props

		const classes = classNames(
			'input',
			'input-slider',
			{'update': this.state.dragging},
			{'hover': this.state.hovering}
		)

		const knobStyle = {
			left: percentage(value, min, max)
		}

		return (
			<div className={classes}>
				<InputNumber
					path={this.props.path}
					value={value}
					onChange={this.handleChange}
					unit={this.props.unit}
				/>
				<div
					className='input-slider__slider'
					ref={el => this.$slider = el}
					onMouseEnter={this.handleHoverSlider.bind(this, true)}
					onMouseLeave={this.handleHoverSlider.bind(this, false)}
				>
					<div className='input-slider__knob' style={knobStyle} />
				</div>
			</div>
		)
	}
}