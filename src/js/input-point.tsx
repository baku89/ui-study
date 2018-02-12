import * as React from 'react'
import * as update from 'immutability-helper'
import * as classNames from 'classnames'

import * as Gesture from './gesture'
import Point from './point'

import SvgOverlay from './svg-overlay'
import InputNumber from './input-number'

import {InputBaseUnitProps, InputBaseState} from './input-base'

interface Props extends InputBaseUnitProps<Point> {
}

interface State extends InputBaseState {
	dragging: boolean,
	dragOrigin: Point,
	dragDest: Point,
}

export default class InputPoint extends React.Component<Props, State> {

	private $slider: HTMLElement
	private gesture: Gesture

	constructor(props: Props) {
		super(props)

		this.state = {			
			hovering: false,
			dragging: false,
			dragOrigin: new Point,
			dragDest: new Point
		}
	}

	componentDidMount() {
		this.gesture = new Gesture(this.$slider)

		this.gesture.on('drag', ({current, delta, multiplyMode}: Gesture.DragEvent) => {

			let x = delta.x
			let y = delta.y

			if (multiplyMode === Gesture.MultiplyMode.More) {
				x *= 10
				y *= 10
			}
			if (multiplyMode === Gesture.MultiplyMode.Less) {
				x *= 0.1
				y *= 0.1
			}

			let newValue = update(this.props.value, {})
			newValue.x += x
			newValue.y += y

			this.props.onChange(newValue)

			this.setState({dragDest: current})
		})

		this.gesture.on('start-drag', (dragOrigin: Point) => {
			this.setState({dragging: true, dragOrigin})
		})
		this.gesture.on('end-drag', () => {
			this.setState({dragging: false})
		})
	}

	componentWillUnmount() {
		this.gesture.dispose()
	}

	

	handleChange = (dim, value) => {

		let updateInfo = {}
		updateInfo[dim] = {$set: value}

		const newValue = update(this.props.value, updateInfo)

		this.props.onChange(newValue)
	}

	handleMouseEnterSlider = () => {
		this.setState({hovering: true})
	}

	handleMouseLeaveSlider = () => {
		this.setState({hovering: false})
	}

	render() {

		const classes = classNames(
			'input',
			'input-point',
			{'update': this.state.dragging},
			{'hover': this.state.hovering}
		)

		const {dragOrigin, dragDest} = this.state

		return (
			<div className={classes}>
				<InputNumber
					path={this.props.path + '/x'}
					value={this.props.value.x}
					onChange={this.handleChange.bind(this, 'x')}
					className='left'
				/>
				<InputNumber
					path={this.props.path + '/y'}
					value={this.props.value.y}
					onChange={this.handleChange.bind(this, 'y')}
					className='right'
				/>

				{this.props.unit &&
					<div className='input__unit'>{this.props.unit}</div>
				}

				<div
					ref={el => this.$slider = el}
					className={classNames('input-point__slider', {'update': this.state.dragging})}
					onMouseEnter={this.handleMouseEnterSlider}
					onMouseLeave={this.handleMouseLeaveSlider}
				/>

				{this.state.dragging &&
					<SvgOverlay>
						<rect
							className='dashed'
							x={Math.min(dragOrigin.x, dragDest.x)}
							y={Math.min(dragOrigin.y, dragDest.y)}
							width={Math.abs(dragDest.x - dragOrigin.x)}
							height={Math.abs(dragDest.y - dragOrigin.y)}
						/>
						<line
							className='bold'
							x1={dragOrigin.x}
							y1={dragOrigin.y}
							x2={dragDest.x}
							y2={dragOrigin.y}
						/>
						<use
							xlinkHref='#arrow'
							transform={`
								translate(${dragDest.x}, ${dragOrigin.y})
								rotate(${dragDest.x - dragOrigin.x > 0 ? 0 : -180})
							`}
						/>
						<line
							className='bold'
							x1={dragOrigin.x}
							y1={dragOrigin.y}
							x2={dragOrigin.x}
							y2={dragDest.y}
						/>
						<use
							xlinkHref='#arrow'
							transform={`
								translate(${dragOrigin.x}, ${dragDest.y})
								rotate(${dragDest.y - dragOrigin.y > 0 ? 90 : -90})
							`}
						/>
					</SvgOverlay>
				}
			</div>
		)

	}

}