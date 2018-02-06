import * as React from 'react'
import * as mezr from 'mezr'

interface Props {
	cursor?: string
}

export default class SvgOverlay extends React.Component<Props, {}> {

	constructor(props) {
		super(props)
	}

	render() {

		const {top, left} = mezr.offset(document.body, window)

		let style: {top: string, left: string, cursor?: string} = {
			top: top + 'px',
			left: left + 'px'
		}

		if (this.props.cursor) {
			style.cursor = this.props.cursor
		}

		return (
			<svg className='svg-overlay' style={style}>
				<defs>
					<g id='arrow'>
						<polygon id='arrow' className='arrow' points='-10,-5, 0,0, -10,5' />
					</g>
				</defs>
				{this.props.children}
			</svg>
		)
	}
}