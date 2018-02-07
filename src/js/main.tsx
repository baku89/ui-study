import * as React from 'react'
import {render} from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import * as update from 'immutability-helper'

import Point from './point'

import {ParamType, Param} from './param'

import ParamsControl from './params-control'

interface State {
	params: Array<Param>
}

class App extends React.Component<{}, State> {

	constructor(props) {
		super(props)

		this.state = {
			params: [
				{type: ParamType.Float, name: 'Float', value: 0},
				{type: ParamType.Point, name: 'Point', value: new Point, unit: 'px'},
				{type: ParamType.Angle, name: 'Angle', value: 0},
				{type: ParamType.Slider, name: 'Slider', value: 0, unit: 'px'},
				{
					type: ParamType.Group,
					name: 'Transform',
					value: [
						{type: ParamType.Point, name: 'Pos', value: new Point(960, 540), unit: 'px'},
						{type: ParamType.Scale, name: 'Scale', value: new Point(100, 100)},
						{type: ParamType.Angle, name: 'Rot', value: 0}
					]
				},
				{type: ParamType.Slider, name: 'Opacity', value: 100, unit: '%'}
			]
		}
	}

	handleChangeParams = (params) => {
		this.setState({params})
	}

	render() {

		return (
			<div className='sidebar'>
				<h1>UI Study</h1>
				<ParamsControl
					path='.'
					params={this.state.params}
					onChange={this.handleChangeParams}
				/>
			</div>
		)

	}
}

render(
	<App />,
	document.querySelector('.app')
)