import { useState, useEffect } from 'react'
import Calendar from '../utils/Calendar';
import DateSelection from '../utils/DateSelection';
import "../styles/DatePicker.css";


const DayTiles = (props) => {

    function dayTileClicked(e) {
        const tile = e.target;
        const date = new Date(props.cal.year, props.cal.month, parseInt(tile.textContent));
        let prevSelection = props.selection.at(-1);
        console.log('prev', prevSelection);

        // initial selection
        if (props.selection.length === 0) {
            let sel = new DateSelection({ openingDate: date, color:  'rgba(60, 60, 60, 0.5)'});
            props.setSelection([sel]);
        } 
        else {
            // start new selection
            if (prevSelection.complete()) {
                props.setSelection([...props.selection, new DateSelection({ openingDate: date, color:  'rgba(60, 60, 60, 0.5)' })]);
            }
            // complete previous selection
            else {       
                prevSelection.closingDate = date;     
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
                    style={ day.color ? { backgroundColor: day.color } : { backgroundColor: null } }
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
            
    
    useEffect(() => {
        // for now: parse through all selections
        // TODO find a way to store the info on which state array element changed (to optimize)
        for (let selection of props.selection) {
            for (let i in cal.days) {
                if (selection.includes(cal.days[i].date)) {
                    let newCal = cal;
                    newCal.days[i].color = selection.color;
                    setCal(newCal)
                }                    
            }
        }
    
    }, [JSON.stringify(props.selection)])  // update on stringified object to catch any value changes

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