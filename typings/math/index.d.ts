declare function lerp(a: number, b: number, t: number): number;
declare function clamp(value: number, min: number, max: number): number;
declare function mod(a: number, b: number): number;
declare function ratio(value: number, bottom: number, top: number, clamped?: boolean): number;
declare function parseNumber(str: string): number;
declare function toFixed(value: number, precision: number, omitZeros?: boolean): string;
declare function toRadians(degrees: number): number;
declare function toDegrees(radians: number): number;
declare function cycleMod(value: number, inc: number, max: number): number;
export { lerp, clamp, parseNumber, toFixed, ratio, mod, toRadians, toDegrees, cycleMod };
