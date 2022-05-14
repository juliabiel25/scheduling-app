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

    startsInMonth(month, year) {
        return this.openingDate.getMonth() === month && this.openingDate.getFullYear() === year
    }

    endsInMonth(month, year) {
        return this.closingDate.getMonth() === month && this.closingDate.getFullYear() === year
    }

    includesMonth(month, year) {
        const monthFirst = new Date(year, month, 1);
        const monthLast = new Date(year, month+1, 0);
        return(
            this.startsInMonth(month, year) || this.endsInMonth(month, year)
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