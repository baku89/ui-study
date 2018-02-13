import * as React from 'react'
import * as update from 'immutability-helper'
import * as classNames from 'classnames'
import * as clamp from 'clamp'

import InputNumber from './input-number'
import * as Gesture from './gesture'
import Point from './point'

import {InputBaseUnitProps, InputBaseState} from './input-base'

interface Props extends InputBaseUnitProps<Point> {
}

interface State extends InputBaseState {
	uniformScale: boolean,
	uniformDragging: boolean,
	dragging: boolean,
	dragOrigin: Point,
	dragStartValue: Point
}

export default class InputScale extends React.Component<Props, State> {
	
	static HudSize: number = 200

	private $slider: HTMLElement
	private gesture: Gesture

	constructor(props: Props) {
		super(props)

		this.state = {
			hovering: false,
			uniformScale: true,
			uniformDragging: false,
			dragging: false,
			dragOrigin: new Point,
			dragStartValue: new Point
		}
	}

	componentDidMount() {
		this.gesture = new Gesture(this.$slider)

		this.gesture.on('drag', ({offset}: Gesture.DragEvent) => {

			const hudScale = Math.min(2, Math.abs(InputScale.HudSize / this.state.dragStartValue.max()))

			if (this.state.uniformScale) {
				let x = this.state.dragStartValue.x + offset.x / hudScale
				this.handleChange('x', x)
			} else {
				let newValue = this.state.dragStartValue.clone()
				newValue.x += offset.x / hudScale
				newValue.y += offset.y / hudScale
				this.props.onChange(newValue)
			}
			

			
		})

		this.gesture.on('start-drag', (dragOrigin: Point) => {
			this.setState({
				dragging: true,
				dragOrigin,
				dragStartValue: this.props.value.clone()
			})
		})
		this.gesture.on('end-drag', () => {
			this.setState({dragging: false})
		})
	}

	componentWillUnmount() {
		this.gesture.dispose()
	}

	handleChange = (dim, value) => {

		let updateInfo = {
			[dim]: {$set: value}
		}

		if (this.state.uniformScale) {

			const prevValue = this.props.value[dim]
			const ratio = prevValue != 0 ? value / prevValue : 1

			const altDim = dim === 'x' ? 'y' : 'x'
			const altPrevValue = this.props.value[altDim]
			const altValue = altPrevValue != 0 ? altPrevValue * ratio : value

			updateInfo[altDim] = {$set: altValue}
		}

		const newValue = update(this.props.value, updateInfo)

		this.props.onChange(newValue)
		
	}

	handleToggleUniformScale = () => {
		this.setState({uniformScale: !this.state.uniformScale})
	}

	handleHoverSlider = (hovering) => {
		this.setState({hovering})
	}

	handleToggleDragInput = (inputDragging) => {

		let uniformDragging: boolean = false

		if (inputDragging) {
			uniformDragging = this.state.uniformScale
		}

		this.setState({uniformDragging})
	}

	handleHoverInput = (inputHovering) => {
		
		let hovering: boolean = false

		if (inputHovering) {
			hovering = this.state.uniformScale
		}

		this.setState({hovering})
	}

	render() {

		const classes = classNames(
			'input',
			'input-scale',
			{'update': this.state.dragging || this.state.uniformDragging},
			{'hover': this.state.hovering}
		)

		const uniformScaleClasses = classNames(
			'input-scale__uniform-scale',
			{'enabled': this.state.uniformScale}
		)

		let dragHud = null

		if (this.state.dragging) {
			const {dragOrigin, dragStartValue} = this.state		
		
			const hudScale = Math.min(2, Math.abs(InputScale.HudSize / dragStartValue.max()))

			const hudWidth = dragStartValue.x * hudScale
			const hudHeight = dragStartValue.y * hudScale

			const hudOriginX = dragOrigin.x - hudWidth
			const hudOriginY = dragOrigin.y - hudHeight

			const w = hudWidth + (this.props.value.x - dragStartValue.x) * hudScale
			const h = hudHeight + (this.props.value.y - dragStartValue.y) * hudScale

			dragHud = (
				<svg className='svg-overlay'>
					<rect
						className='dashed'
						x={hudOriginX}
						y={hudOriginY}
						width={Math.abs(100 * hudScale)}
						height={Math.abs(100 * hudScale)}
					/>
					<rect
						className='bold'
						x={Math.min(hudOriginX, hudOriginX + w)}
						y={Math.min(hudOriginY, hudOriginY + h)}
						width={Math.abs(w)}
						height={Math.abs(h)}
					/>
				</svg>
			)
		}

		return (
			<div className={classes}>
				<InputNumber
					className='left'
					path={this.props.path + '/x'}
					value={this.props.value.x}
					onChange={this.handleChange.bind(this, 'x')}
					onToggleDrag={this.handleToggleDragInput}
					onHover={this.handleHoverInput}
				/>

				<div
					className={uniformScaleClasses}
					onClick={this.handleToggleUniformScale}
				/>

				<InputNumber
					className='right'
					path={this.props.path + '/y'}
					value={this.props.value.y}
					onChange={this.handleChange.bind(this, 'y')}
					onToggleDrag={this.handleToggleDragInput}
					onHover={this.handleHoverInput}
				/>

				<div className='input__unit'>%</div>

				<div
					ref={el => this.$slider = el}
					className={classNames('input-scale__slider', {'update': this.state.dragging})}
					onMouseEnter={this.handleHoverSlider.bind(this, true)}
					onMouseLeave={this.handleHoverSlider.bind(this, false)}
				/>

				{dragHud}
			</div>
		)

	}

}