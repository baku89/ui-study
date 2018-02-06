import * as React from 'react'

interface Props {
	label: string
}

export default class ParamRow extends React.Component<Props, {}> {

	constructor(props: Props) {
		super(props)
	}

	render() {
		return (
			<li className='param-row'>
				<div className='param-row__label'>{this.props.label}</div>
				<div className='param-row__control'>{this.props.children}</div>
			</li>
		)
	}
}