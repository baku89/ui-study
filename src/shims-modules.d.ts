declare module 'uid' {
	export default function(length: number): string
}

declare module 'mouse-event' {
	export function buttons(event: MouseEvent): number
}
