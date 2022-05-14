import { useState, useEffect } from 'react'
import Calendar from '../utils/Calendar';
import DateSelection from '../utils/DateSelection';
import "../styles/DatePicker.css";


const DayTiles = ({cal, initDate, finalDate, selectionSet, setSelectionSet, activeSelection, setActiveSelection}) => {

    function dayTileClicked(e) {
        const tile = e.target;
        const date = new Date(cal.year, cal.month, parseInt(tile.textContent));
        
        // initial or complete active selection -> save new opening date
        if (activeSelection.blank() || activeSelection.complete()) {
            let sel = new DateSelection({openingDate: date, color: 'rgba(60, 60, 60, 0.5)'});
            setActiveSelection(sel);            
        } 

        // complete the selection if incomplete (and assume that the color is immediately assigned)
        else if (activeSelection.incomplete()) {
            let sel = new DateSelection({openingDate:activeSelection.openingDate, closingDate: date, color: 'rgba(60, 60, 60, 0.5)'});
            setSelectionSet([...selectionSet, sel]);
            setActiveSelection(sel);
        }
    }

    return(
        cal.days.map(           
            day => (
                <div  
                    key={ `${day.isCurrentMonth.toString()}-${day.date.toString()}` }
                    className={
                        `day-tile 
                        ${day.isEnabled ? 'tile-enabled' : 'tile-disabled'} 
                        ${day.isCurrentMonth ? 'current-month-tile' : 'previousMonthTile'}`
                    }
                    onClick={ day.isEnabled ? dayTileClicked : undefined }
                    style={ {backgroundColor: day.color} }
                >
                        { day.date.getDate() }
                </div>
            )
        )
    )
};
    
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
            props.year, 
            props.initDate, 
            props.finalDate)
    );             

    useEffect(() => {
        // if the new active selection concerns this particular month's calendar, assign colors
        if (props.activeSelection.complete() && props.activeSelection.includesMonth(props.month, props.year)) {
            let start = new Date(props.year, props.month, 1);     // first day of the month
            let finish = new Date(props.year, props.month+1, 0);  // last day of the month
            
            if (props.activeSelection.startsInMonth(props.month, props.year))
            start = props.activeSelection.openingDate;
            if (props.activeSelection.endsInMonth(props.month, props.year))
            finish = props.activeSelection.closingDate;

            for (let day = start; day <= finish; day.setDate(day.getDate() + 1)) {
                
                let dayIndex = cal.days.findIndex(it => it.date.getTime() === day.getTime())
                if (dayIndex !== -1) {
                    let modDay = cal.days[dayIndex];
                    modDay.color = props.activeSelection.color;
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
    



    return (
        <div className="date-picker">
            <div className="month-label">
                {cal.getMonthName()} {cal.year}
            </div>
            <div className="day-tiles">
                <WeekdayLabels cal={cal} />
                <DayTiles 
                    cal={cal} 
                    // days={days}
                    initDate={props.initDate}
                    finalDate={props.finalDate}
                    selectionSet={props.selectionSet} 
                    setSelectionSet={props.setSelectionSet}
                    activeSelection={props.activeSelection}
                    setActiveSelection={props.setActiveSelection} />
            </div>
        </div>
    );
}

export default DatePicker;