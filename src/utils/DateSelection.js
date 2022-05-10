export default class DateSelection {
    constructor() {
        this.selection = []
    }

    get selection() {
        return this.selection
    }

    clear() {
        this.selection = []
    }

    add(newSelection) {
        this.selection.push(newSelection)
    }

    
}

