import { useState } from 'react'
import Calendar from '../utils/Calendar';
import "../styles/DatePicker.css";


const DayTiles = (props) => {

    function dayTileClicked(e) {
        const tile = e.target;
        const date = new Date(props.cal.year, props.cal.month, parseInt(tile.textContent));
        let prevSelection = props.selection.at(-1);

        // initial selection
        if (props.selection.length === 0) {
            props.setSelection([[date, null]]);
        } 
        else {
            // start new selection
            if (prevSelection[0] !== null && prevSelection[1] !== null) {
                props.setSelection([...props.selection, [date, null]]);
            }
            // complete previous selection
            if (prevSelection[0] !== null && prevSelection[1] === null) {       
                prevSelection[1] = date;     
                props.setSelection([...props.selection.slice(0, props.selection.length - 1), prevSelection]);
            }
        } 
    }

    return(
        props.cal.days.map(           
            day => (
                <div  
                    key={ `${day.isCurrentMonth.toString()}-${day.date.toString()}` }
                    className={
                        `day-tile 
                        ${day.isEnabled ? 'tile-enabled' : 'tile-disabled'} 
                        ${day.isCurrentMonth ? 'current-month-tile' : 'previousMonthTile'}`
                    }
                    onClick={ day.isEnabled ? dayTileClicked : undefined }
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
            props.finalDate));    

    return (
        <div className="date-picker">
            <div className="month-label">
                {cal.getMonthName()} {cal.year}
            </div>
            <div className="day-tiles">
                <WeekdayLabels cal={cal} />
                <DayTiles 
                    cal={cal} 
                    initDate={props.initDate}
                    finalDate={props.finalDate}
                    selection={props.selection} 
                    setSelection={props.setSelection} />
            </div>
        </div>
    );
}

export default DatePicker;