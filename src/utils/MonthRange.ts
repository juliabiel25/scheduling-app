class MonthRange {
  initDate: Date | null = null;
  finalDate: Date | null = null;

  constructor(initDate: Date | null, finalDate: Date | null) {
    this.initDate = initDate;
    this.finalDate = finalDate;
  }

  getNumberOfMonths() {
    if (!this.initDate || !this.finalDate) return 0;
    return this.finalDate.getMonth() - this.initDate.getMonth() + 1;
  }
}

export default MonthRange;
