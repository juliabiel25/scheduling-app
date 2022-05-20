import { range } from './functions';

class Day {
	constructor({
		date = Date(),
		isSelected = false,
		isEnabled = true,
		isHovered = false,
		selectionGroup = undefined,
		isCurrentMonth = true,
		color = null
	}){
		this.date = date;
		this.isSelected = isSelected;
		this.isEnabled = isEnabled;
		this.isHovered = isHovered;
		this.selectionGroup = selectionGroup;
		this.isCurrentMonth = isCurrentMonth;
		this.color = color;
	}
}

class Calendar {
	constructor(month, dateRange) {

		const [initDate, finalDate] = dateRange;
		this.year = month[1];
		this.month = month[0];
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
					date: new Date(this.year, (this.month - 1) % 12, day),
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

	includesDate = date => date >= this.currentMonthDays[0].date && date <= this.currentMonthDays.at(-1).date; 

	rangeHover = (start, end, hoverColor) => {
		for(let i in this.days)
			if ((this.days[i].date <= end && this.days[i].date >= start)
            || (this.days[i].date >= end && this.days[i].date <= start))
				this.days[i].isHovered = true;
			else
				this.days[i].isHovered = false;
	}

	clearHover = () => {
		for (let i in this.days)
			this.days[i].isHovered = false;
	}

}
 
export default Calendar;