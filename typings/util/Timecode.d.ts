export default class Timecode {
    static formatSimple(frameCount: number, frameRate: number): string;
    frameRate: number;
    readonly dropFrame: boolean;
    frameCount: number;
    frames: number;
    readonly framesText: string;
    seconds: number;
    readonly secondsText: string;
    minutes: number;
    readonly minutesText: string;
    hours: number;
    readonly hoursText: string;
    smpte: string;
    private _frameRate;
    private _dropFrame;
    private _frameCount;
    private _hours;
    private _minutes;
    private _seconds;
    private _frames;
    private _hoursText;
    private _minutesText;
    private _secondsText;
    private _framesText;
    constructor(frameCount?: number, frameRate?: number);
    private validateFrameRate;
    private updateSMTPE;
}
