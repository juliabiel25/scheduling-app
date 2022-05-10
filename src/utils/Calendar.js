
class Calendar {
	constructor(date) {

		this.date = date;
		this.year = date.getFullYear();
		this.month = date.getMonth();
		this.numOfDays = new Date(this.year, this.month + 1, 0).getDate();
		this.firstWeekday = new Date(this.year, this.month, 1).getDay();
		this.offset = (this.firstWeekday + 6)%7;
		
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