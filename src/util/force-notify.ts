export default function forceNotify(obj: any) {
	if (obj.__ob__) {
		obj.__ob__.dep.notify()
	}
}
