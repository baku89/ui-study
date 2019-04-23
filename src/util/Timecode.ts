import {isInteger} from '../math'

const DROPFRAME_FRAMERATE = new Set([23.976, 29.97, 59.94])

export default class Timecode {
	public static formatSimple(frameCount: number, frameRate: number): string {
		let fc = Math.abs(frameCount)

		// Adjust for dropFrame
		// https://github.com/CrystalComputerCorp/smpte-timecode/blob/master/smpte-timecode.js
		if (DROPFRAME_FRAMERATE.has(frameRate)) {
			const df = frameRate === 29.97 ? 2 : 4 // 59.94 skips 4 frames
			const d = Math.floor(frameCount / ((17982 * df) / 2))
			let m = frameCount % ((17982 * df) / 2)
			if (m < df) {
				m = m + df
			}
			fc += 9 * df * d + df * Math.floor((m - df) / ((1798 * df) / 2))
		}

		const fps = Math.round(frameRate)

		const frames = fc % fps
		const seconds = Math.floor(fc / fps) % 60
		const minutes = Math.floor(fc / (fps * 60)) % 60
		const hours = Math.floor(fc / (fps * 3600)) % 24

		let text = frameCount < 0 ? '-' : ''

		if (frames) {
			text += (frames < 10 ? '0' : '') + frames.toString() + 'f'
		} else if (seconds) {
			text += (seconds < 10 ? '0' : '') + seconds.toString() + 's'
		} else if (minutes) {
			text += (minutes < 10 ? '0' : '') + minutes.toString() + 'm'
		} else if (hours) {
			text += (hours < 10 ? '0' : '') + hours.toString() + 'h'
		} else {
			text = '0f'
		}

		return text
	}

	public static formatIncrementalValue(
		frameCount: number,
		frameRate: number
	): string {
		let fc = Math.abs(frameCount)

		// Adjust for dropFrame
		// https://github.com/CrystalComputerCorp/smpte-timecode/blob/master/smpte-timecode.js
		if (DROPFRAME_FRAMERATE.has(frameRate)) {
			const df = frameRate === 29.97 ? 2 : 4 // 59.94 skips 4 frames
			const d = Math.floor(frameCount / ((17982 * df) / 2))
			let m = frameCount % ((17982 * df) / 2)
			if (m < df) {
				m = m + df
			}
			fc += 9 * df * d + df * Math.floor((m - df) / ((1798 * df) / 2))
		}

		const fps = Math.round(frameRate)

		const frames = fc % fps
		const seconds = Math.floor(fc / fps) % 60
		const minutes = Math.floor(fc / (fps * 60)) % 60
		const hours = Math.floor(fc / (fps * 3600)) % 24

		let text = frameCount < 0 ? '-' : '+'

		if (hours) {
			text += (hours < 10 ? '0' : '') + hours.toString() + 'h '
		}
		if (minutes) {
			text += (minutes < 10 ? '0' : '') + minutes.toString() + 'm '
		}
		if (seconds) {
			text += (seconds < 10 ? '0' : '') + seconds.toString() + 's '
		}
		text += (frames < 10 ? '0' : '') + frames.toString() + 'f'

		return text
	}

	get frameRate(): number {
		return this._frameRate
	}
	set frameRate(frameRate: number) {
		this.validateFrameRate(frameRate)
		this._frameRate = frameRate
		this.updateSMTPE()
	}

	get dropFrame(): boolean {
		return this._dropFrame
	}

	get frameCount(): number {
		return this._frameCount
	}
	set frameCount(frameCount: number) {
		this._frameCount = Math.round(frameCount)
		this.updateSMTPE()
	}

	get frames(): number {
		return this._frames
	}
	set frames(frames: number) {
		const fps = Math.round(this._frameRate)
		this._frameCount =
			frames +
			this._seconds * fps +
			this._minutes * 60 * fps +
			this._hours * 3600 * fps
		this.updateSMTPE()
	}
	get framesText(): string {
		return this._framesText
	}

	get seconds(): number {
		return this._seconds
	}
	set seconds(seconds: number) {
		const fps = Math.round(this._frameRate)
		this._frameCount =
			this._frames +
			seconds * fps +
			this._minutes * 60 * fps +
			this._hours * 3600 * fps
		this.updateSMTPE()
	}
	get secondsText(): string {
		return this._secondsText
	}

	get minutes(): number {
		return this._minutes
	}
	set minutes(minutes: number) {
		const fps = Math.round(this._frameRate)
		this._frameCount =
			this._frames +
			this._seconds * fps +
			minutes * 60 * fps +
			this._hours * 3600 * fps
		this.updateSMTPE()
	}
	get minutesText(): string {
		return this._minutesText
	}

	get hours(): number {
		return this._hours
	}
	set hours(hours: number) {
		const fps = Math.round(this._frameRate)
		this._frameCount =
			this._frames +
			this._seconds * fps +
			this._minutes * 60 * fps +
			hours * 3600 * fps
		this.updateSMTPE()
	}
	get hoursText(): string {
		return this._hoursText
	}

	get smpte(): string {
		return (
			this._hoursText +
			':' +
			this._minutesText +
			':' +
			this._secondsText +
			(this._dropFrame ? ';' : ':') +
			this._framesText
		)
	}
	set smpte(smpte: string) {
		const sign = smpte.startsWith('-') ? -1 : 1

		const parts = smpte
			.replace(/^-/, '')
			.split(/:|;|\./)
			.map((v: string) => parseInt(v, 10) || 0)

		if (parts.length < 4) {
			parts.unshift(...Array(4 - parts.length).fill(0))
		} else if (parts.length > 4) {
			throw new Error('Invalid timecode string')
			return
		}

		const [hours, minutes, seconds, frames] = parts

		const fps = Math.round(this._frameRate)
		this._frameCount =
			(frames + seconds * fps + minutes * 60 * fps + hours * 3600 * fps) * sign
		this.updateSMTPE()
	}

	private _frameRate!: number
	private _dropFrame!: boolean

	private _frameCount!: number
	private _hours!: number
	private _minutes!: number
	private _seconds!: number
	private _frames!: number

	private _hoursText!: string
	private _minutesText!: string
	private _secondsText!: string
	private _framesText!: string

	constructor(frameCount: number = 0, frameRate: number = 29.97) {
		this._frameCount = Math.round(frameCount)

		this.validateFrameRate(frameRate)
		this._frameRate = frameRate

		this.updateSMTPE()
	}

	private validateFrameRate(frameRate: number) {
		const dropFrame = DROPFRAME_FRAMERATE.has(frameRate)

		if (frameRate <= 0 || (!this._dropFrame && !isInteger(frameRate))) {
			throw new Error(
				'Number expected as positive integer or 23.976/29.97/59.94'
			)
			return
		}

		this._dropFrame = dropFrame
	}

	private updateSMTPE() {
		let fc = Math.abs(this._frameCount)

		// Adjust for dropFrame
		// https://github.com/CrystalComputerCorp/smpte-timecode/blob/master/smpte-timecode.js
		if (this._dropFrame) {
			const df = this._frameRate === 29.97 ? 2 : 4 // 59.94 skips 4 frames
			const d = Math.floor(this.frameCount / ((17982 * df) / 2))
			let m = this.frameCount % ((17982 * df) / 2)
			if (m < df) {
				m = m + df
			}
			fc += 9 * df * d + df * Math.floor((m - df) / ((1798 * df) / 2))
		}

		const fps = Math.round(this._frameRate)

		this._frames = fc % fps
		this._seconds = Math.floor(fc / fps) % 60
		this._minutes = Math.floor(fc / (fps * 60)) % 60
		this._hours = Math.floor(fc / (fps * 3600)) % 24

		this._hoursText =
			(this._frameCount < 0 ? '-' : '') +
			(this._hours < 10 ? '0' : '') +
			this._hours.toString()
		this._minutesText =
			(this._minutes < 10 ? '0' : '') + this._minutes.toString()
		this._secondsText =
			(this._seconds < 10 ? '0' : '') + this._seconds.toString()
		this._framesText = (this._frames < 10 ? '0' : '') + this._frames.toString()
	}
}
