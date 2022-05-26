import { range } from './functions';
import Day from './Day';

class Calendar {
  year: number;
  month: number;
  numOfDays: number;
  firstWeekday: number;
  offset: number;
  previousMonthLength: number;
  previousMonthDays: Day[];
  currentMonthDays: Day[];
  days: Day[];
  weekdayNames: string[];
  monthNames: string[];

  constructor(monthYear: [number, number], dateRange: Date[]) {
    const [initDate, finalDate] = dateRange;
    this.year = monthYear[1];
    this.month = monthYear[0];
    this.numOfDays = new Date(this.year, this.month + 1, 0).getDate();
    this.firstWeekday = new Date(this.year, this.month, 1).getDay();
    this.offset = (this.firstWeekday + 6) % 7;

    this.previousMonthLength = new Date(this.year, this.month, 0).getDate();

    this.previousMonthDays = range(
      this.previousMonthLength - this.offset + 1,
      this.previousMonthLength,
    ).map(
      (day) =>
        new Day(
          new Date(this.year, (this.month - 1) % 12, day),
          undefined,
          false,
          undefined,
          false,
        ),
    );

    this.currentMonthDays = range(1, this.numOfDays).map((day) => {
      const date = new Date(this.year, this.month, day);
      if (date < initDate || date > finalDate)
        return new Day(date, undefined, false);
      else return new Day(date);
    });

    this.days = [...this.previousMonthDays, ...this.currentMonthDays];

    this.weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
  }

  getMonthName = () => this.monthNames[this.month];

  includesDate = (date: Date): boolean => {
    if (!this.currentMonthDays) return false;
    const firatDay = this.currentMonthDays.at(0);
    const lastDay = this.currentMonthDays.at(-1);
    if (!firatDay || !lastDay) return false;
    return date >= firatDay.date && date <= lastDay.date;
  };

  rangeHover = (start: Date, end: Date): void => {
    for (let i in this.days)
      if (
        (this.days[i].date <= end && this.days[i].date >= start) ||
        (this.days[i].date >= end && this.days[i].date <= start)
      )
        this.days[i].isHovered = true;
      else this.days[i].isHovered = false;
  };

  clearHover = (): void => {
    for (let i in this.days) this.days[i].isHovered = false;
  };
}

export default Calendar;
