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

    startsInMonth(month) {
        return (
            this.openingDate.getMonth() === month.month 
            && this.openingDate.getFullYear() === month.year
        )
    }

    endsInMonth(month) {
        return (
            this.closingDate.getMonth() === month.month 
            && this.closingDate.getFullYear() === month.year
        )
    }

    includesMonth(month) {
        const monthFirst = new Date(month.year, month.month, 1);
        const monthLast = new Date(month.year, month.month + 1, 0);
        return (
            this.startsInMonth(month) 
            || this.endsInMonth(month)
            || (this.openingDate <= monthFirst && this.closingDate >= monthLast)
        )
    }

    includesDay(day) {
        return day >= this.openingDate && day <= this.closingDate;
    }

    blank() {
        return this.openingDate === null && this.closingDate === null;
    }

    complete() {
        return this.openingDate !== null && this.closingDate !== null;
    }

    incomplete() {
        return this.openingDate !== null && this.closingDate === null;
    }

    toString() {
        if (this.complete()) 
            return `${this.openingDate.toLocaleDateString("en-US")} - ${this.closingDate.toLocaleDateString("en-US")}`
        return `${this.openingDate.toLocaleDateString("en-US")} - ...`

    }
}

export default DateSelection;