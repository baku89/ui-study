import * as React from 'react'
import * as classNames from 'classnames'

import InputNumber from './input-number'
import * as Gesture from './gesture'
import Point from './point'

import {mod} from './math-utils'
import {getDOMCenter} from './dom-utils'

import SvgOverlay from './svg-overlay'

import {InputBaseProps, InputBaseState} from './input-base'

interface Props extends InputBaseProps<number> {
}

interface State extends InputBaseState {
	unit: string,
	dragging: boolean,
	dragOrigin: Point,
	dragDistance: number
}

export default class InputAngle extends React.Component<Props, State> {

	private updateTimer: any
	private $sliderWrapper: HTMLElement
	private $slider: HTMLElement
	private gesture: Gesture

	constructor(props: Props) {
		super(props)

		this.state = {
			unit: '°',
			hovering: false,
			dragging: false,
			dragOrigin: new Point,
			dragDistance: 0
		}
	}

	componentDidMount() {
		this.gesture = new Gesture(this.$slider)

		let rotation: number
		let offset = new Point()
		let prevOffset = new Point()

		const axisOrigin = new Point()
		const axisXMinus = new Point(-10000, 0)

		this.gesture.on('drag', ({current, multiplyMode}: Gesture.DragEvent) => {

			const origin = getDOMCenter(this.$sliderWrapper)

			offset.x = -(current.y - origin.y)
			offset.y =  (current.x - origin.x)

			// check if mouse traversed axis -X
			if (prevOffset.x < 0 && offset.x < 0
				&& prevOffset.y != offset.y
				&& prevOffset.y * offset.y <= 0) {
				
				rotation += offset.y >= 0 ? -1 : +1
			}

			// if (prevOffset.x < 0 &)

			const angleRad = Math.atan2(offset.y, offset.x)
			let angle = angleRad / Math.PI * 180

			if (multiplyMode === Gesture.MultiplyMode.More) {
				angle = Math.round(angle / 45) * 45
			} else if (multiplyMode !== Gesture.MultiplyMode.Less) {
				angle = Math.round(angle)
			}

			let newValue = rotation * 360 + angle

			prevOffset.copy(offset)

			this.props.onChange(newValue)

			this.setState({
				dragOrigin: origin,
				dragDistance: origin.getDistance(current)
			})
		})

		this.gesture.on('start-drag', (origin: Point) => {
			rotation = Math.floor(this.props.value / 360)
			prevOffset.copy(origin)
			this.setState({dragging: true})
		})
		this.gesture.on('end-drag', () => {
			this.setState({dragging: false})
		})
	}

	componentWillUnmount() {
		this.gesture.dispose()
	}

	handleChange = (value) => {
		this.props.onChange(value)
	}

	handleMouseEnterSlider = () => {
		this.setState({hovering: true})
	}

	handleMouseLeaveSlider = () => {
		this.setState({hovering: false})
	}
	
	// convertFunc = (value:number, unit:string) : number => {

	// 	if (unit === 'rad') {
	// 		return value / Math.PI * 180
	// 	}

	// 	if (unit === 'pi') {
	// 		return value * 180
	// 	}
	// }

	render() {

		const value = this.props.value
		const {dragOrigin, dragDistance} = this.state

		const hudRadius = 60

		const classes = classNames(
			'input',
			'input-angle',
			{'update': this.state.dragging},
			{'hover': this.state.hovering}
		)

		const a = value / 180 * Math.PI

		const arcEndX = dragOrigin.x + hudRadius *  Math.sin(a)
		const arcEndY = dragOrigin.y + hudRadius * -Math.cos(a)

		const dragDest = new Point(
			dragOrigin.x + Math.max(dragDistance, hudRadius) *  Math.sin(a),
			dragOrigin.y + Math.max(dragDistance, hudRadius) * -Math.cos(a)
		)

		const arcPath = `
			M ${dragOrigin.x},${dragOrigin.y - hudRadius}
			A
				${hudRadius} ${hudRadius}
				0
				${mod(Math.abs(value), 360) > 180 ? 1 : 0}
				${value >= 0 ? 1 : 0}
				${arcEndX} ${arcEndY}
		`

		return (
			<div className={classes}>
				<InputNumber
					path={this.props.path}
					value={value}
					onChange={this.handleChange}
					unit='°'
					altUnits={{rad: 1 / Math.PI * 180, pi: 180, deg: 1, x: 360}}
				/>

				<div
					ref={el => this.$sliderWrapper = el}
					className='input-angle__slider-wrapper'
				>
					<div
						ref={el => this.$slider = el}
						className={classNames('input-angle__slider', {'update': this.state.dragging})}
						style={{transform: `rotate(${this.props.value}deg)`}}
						onMouseEnter={this.handleMouseEnterSlider}
						onMouseLeave={this.handleMouseLeaveSlider}
					/>
				</div>

				{this.state.dragging &&
					<SvgOverlay>
						<circle
							className='dashed'
							cx={dragOrigin.x}
							cy={dragOrigin.y}
							r={hudRadius}
						/>
						<line
							className='dashed'
							x1={dragOrigin.x}
							y1={dragOrigin.y}
							x2={dragOrigin.x}
							y2={dragOrigin.y - hudRadius}
						/>
						<path className='bold' d={arcPath} />
						<line
							className='bold'
							x1={dragOrigin.x}
							y1={dragOrigin.y}
							x2={dragDest.x}
							y2={dragDest.y}
						/>
						<use
							xlinkHref='#arrow'
							transform={`
								translate(${arcEndX}, ${arcEndY})
								rotate(${value > 0 ? value : value + 180})
							`}
						/>
					</SvgOverlay>
				}
			</div>
		)

	}

}