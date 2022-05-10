import { range } from './functions';

class Day {
	constructor({
		date = Date(),
		isSelected = false,
		isEnabled = true,
		selectionGroup = undefined,
		isCurrentMonth = true
	}) {
		this.date = date;
		this.isSelected = isSelected;
		this.isEnabled = isEnabled;
		this.selectionGroup = selectionGroup;
		this.isCurrentMonth = isCurrentMonth;
	}
}

class Calendar {
	constructor(month, year, initDate, finalDate) {

		this.year = year;
		this.month = month;
		this.numOfDays = new Date(this.year, this.month + 1, 0).getDate();
		this.firstWeekday = new Date(this.year, this.month, 1).getDay();
		this.offset = (this.firstWeekday + 6)%7;

		this.previousMonthLength = new Date(this.year, this.month, 0).getDate();

		this.previousMonthDays = range(
				this.previousMonthLength - this.offset + 1,
				this.previousMonthLength
			)
			.map(
				day => new Day({
					date: new Date(this.year, this.month, day),
					isCurrentMonth: false,
					isEnabled: false
				})
			)
		
		this.currentMonthDays = range(1, this.numOfDays)
			.map(
				day => {
					const date = new Date(this.year, this.month, day);
					if (date < initDate || date > finalDate)
						return (
							new Day({ 
								date: date,
								isEnabled: false
						}))
					else return (new Day({ date: date }));					
				}
			);


		this.days = [...this.previousMonthDays, ...this.currentMonthDays]
		
		this.weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];  
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
			'Dec'
		]   
	}
  
	getMonthName = () => this.monthNames[this.month];

}
 
export default Calendar;