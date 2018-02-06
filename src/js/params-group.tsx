import * as React from 'react'
import * as classNames from 'classnames'
import * as isEqual from 'lodash.isequal'

interface Props {
	label: string
}

interface State {
	expanded: boolean
}

export default class ParamsGroup extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props)

		this.state = {
			expanded: true
		}
	}

	shouldComponentUpdate(nextProps: Props, nextState: State) {
		if (this.state.expanded == nextState.expanded) {
			// not changing 
			if (nextState.expanded) {
				// keep opening
				return true
			} else {
				// keep closing
				return false
			}
		} else {
			// label clicked
			return true
		}
	}

	handleClickLabel = () => {
		this.setState({expanded: !this.state.expanded})
	}

	render() {

		const classes = classNames('param-group', {'expanded': this.state.expanded})
		
		return (
			<li className={classes}>
				<div
					className='param-group__label'
					onClick={this.handleClickLabel}
				>
					{this.props.label}
				</div>
				<div className='param-group__control'>
					{this.props.children}
				</div>
			</li>
		)
	}
}