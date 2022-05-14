class DateSelection {
    constructor({
        openingDate = null, 
        closingDate = null, 
        color = null
    }) {
        this.openingDate = openingDate;
        this.closingDate = closingDate;
        this.color = color;
    }

    includes(day) {
        return day >= this.openingDate && day <= this.closingDate;
    }

    complete() {
        return this.openingDate !== null && this.closingDate !== null;
    }

    toString() {
        if (this.complete()) 
            return `${this.openingDate.toLocaleDateString("en-US")} - ${this.closingDate.toLocaleDateString("en-US")}`
        return `${this.openingDate.toLocaleDateString("en-US")} - ...`

    }
}

export default DateSelection;