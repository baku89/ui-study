type MeasureElement = HTMLElement | Window | Document
type Edge = 'border' | 'content' | 'padding' | 'scroll' | 'border' | 'margin'
interface Offset {
	left: number
	top: number
}
interface Rect {
	width: number
	height: number
	left: number
	right: number
	top: number
	bottom: number
}

declare module 'mezr' {
	export default class mezr {
		public static width(el: MeasureElement, edge?: Edge): number
		public static height(el: MeasureElement, edge?: Edge): number
		public static offset(el: MeasureElement, edge?: Edge): Offset
		public static rect(el: MeasureElement, edge?: Edge): Rect
	}
}

declare module 'uid' {
	export default function(length: number): string
}
