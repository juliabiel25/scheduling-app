import { useState, useEffect } from 'react'
import Calendar from '../utils/Calendar';
import DayTile from './DayTile';
import "../styles/DatePicker.css";

    
const WeekdayLabels = (props) => {
    const weekdays = props.cal.weekdayNames.map((wd) => (
    <div key={wd} className="weekday-label">{wd}</div>
    ));
    return weekdays;
};

const DatePicker = (props) => {   

    const [cal, setCal] = useState(
        new Calendar(
            props.month,
            props.dateRange));             

    const replaceDay = (newDay, index) => (
        setCal({
            ...cal, 
            days: [
                ...cal.days.slice(0, index), 
                newDay, 
                ...cal.days.slice(index + 1)
            ]
        })
    )

    const clearHover = () => {
        let newCal = cal;
        newCal.clearHover();
        setCal(newCal);
    }

    // assign colors to tiles based on active selection
    useEffect(() => {
        
        // selection inclomplete - assign color to the day opening a new selection
        if (
            props.activeSelection.value.incomplete() 
            && cal.includesDate(props.activeSelection.value.openingDate)
        ) {
            let dayIndex = cal.days.findIndex(
                day => (
                    day.date.getTime() === props.activeSelection.value.openingDate.getTime()
                ))        

            let modDay = cal.days[dayIndex];
            modDay.color = props.activeSelection.value.color;
            setCal({
                ...cal, 
                days: [
                    ...cal.days.slice(0, dayIndex), 
                    modDay, 
                    ...cal.days.slice(dayIndex + 1)
                ]
            })
        }

        // if selection is complete - assign color to all the days within the selection
        else if (
            props.activeSelection.value.complete() 
            && props.activeSelection.value.includesMonth(props.month)
        ) {
            let start = new Date(props.month.year, props.month.month, 1);     // first day of the month
            let finish = new Date(props.month.year, props.month.month + 1, 0);  // last day of the month
            
            if (props.activeSelection.value.startsInMonth(props.month))
                start = props.activeSelection.value.openingDate;
            
            if (props.activeSelection.endsInMonth(props.month, props.year))
                finish = props.activeSelection.value.closingDate;

            for (let day = start; day <= finish; day.setDate(day.getDate() + 1)) {
                
                let dayIndex = cal.days.findIndex(
                    it => it.date.getTime() === day.getTime())

                if (dayIndex !== -1) {
                    let modDay = cal.days[dayIndex];
                    modDay.color = props.activeSelection.value.color;
                    setCal({
                        ...cal, 
                        days: [
                            ...cal.days.slice(0, dayIndex), 
                            modDay, 
                            ...cal.days.slice(dayIndex + 1)
                        ]
                    })
                }
            }            
        }
    }, [props.activeSelection])

    

    const dayTiles = cal.days.map((day, index) => 
        <DayTile 
            key={day.date}

            day={{
                value: day, 
                set: newDay => replaceDay(newDay, index)
            }}          
            hoverSelection={{...props.hoverSelection, clear: clearHover}}
            activeSelection={props.activeSelection}            
            mouseOverListening={props.mouseOverListening} />
    )

    return (
        <div className="date-picker">
            <div className="month-label">
                {cal.getMonthName()} {cal.year}
            </div>
            <div className="day-tiles">
                <WeekdayLabels cal={cal} />
                {dayTiles} 
            </div>
        </div>
    );
}

export default DatePicker;