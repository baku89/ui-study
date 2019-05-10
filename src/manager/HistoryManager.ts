interface HistoryDescriptor {
	undo: () => void
	redo: () => void
	label?: string
}

class HistoryManager {
	private histories: HistoryDescriptor[] = []
	private index: number = 0

	public addHistory(descriptor: HistoryDescriptor) {
		if (this.index >= 1) {
			this.histories.splice(0, this.index)
			this.index = 0
		}
		this.histories.unshift(descriptor)
	}

	public get canUndo(): boolean {
		return this.index < this.histories.length
	}

	public get canRedo(): boolean {
		return this.index >= 1
	}

	public undo() {
		if (!this.canUndo) {
			console.log('cannot undo')
			return
		}
		this.histories[this.index].undo()
		this.index++
	}

	public redo() {
		if (!this.canRedo) {
			console.log('cannot redo')
			return
		}
		this.index--
		this.histories[this.index].redo()
	}
}

export default new HistoryManager()
