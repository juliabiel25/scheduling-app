import { range } from '../utils/functions';
import Calendar from '../utils/Calendar';
import "../styles/DatePicker.css";


const DayTiles = (props) => {

    function dayTileClicked(e) {
        const tile = e.target

        // start new selection
        if ((props.selection[0] === null && props.selection[1] === null) || (props.selection[0] != null && props.selection[1] != null)) {
            props.setSelection([tile.textContent, null]);
        }
        // complete selection
        if (props.selection[0] != null && props.selection[1] == null) {            
            props.setSelection([props.selection[0], Date()]);
        }
    }
    
    const prevMonthLength = new Date(
        props.cal.year,
        props.cal.month,
        0
    ).getDate();
    
    const prevMonthDays = range(
        prevMonthLength - props.cal.offset + 1,
        prevMonthLength
    );
    
    const currMonthDays = range(1, props.cal.numOfDays);
    
    const prevMonthTiles = prevMonthDays.map((day) => (
        <div 
            key={`${props.cal.month - 1}-${day}`} 
            className="day-tile tile-disabled">
                {day}
        </div>
    ))

    const currMonthTiles = currMonthDays.map((day) => {
        // if the tile is < initDate
        if (props.cal.month === props.initDate.getMonth() && day < props.initDate.getDate()) {
            return (
                <div  
                    key={`${props.cal.month}-${day}`}
                    className="day-tile tile-curr-month tile-disabled">
                        {day}
                </div>
            )
        }

        //if the tile is < initDate
        if (props.cal.month === props.finalDate.getMonth() && day > props.finalDate.getDate()) {
            return (
                <div  
                    key={`${props.cal.month}-${day}`}
                    className="day-tile tile-curr-month tile-disabled">
                        {day}
                </div>
            )
        }

        return (
            <div  
                key={`${props.cal.month}-${day}`}
                className="day-tile tile-curr-month tile-enabled" 
                onClick={(e)=>(dayTileClicked(e))}>
                    {day}
            </div>
        )
    });

    return [...prevMonthTiles, ...currMonthTiles];
};
    
const WeekdayLabels = (props) => {
    const weekdays = props.cal.weekdayNames.map((wd) => (
    <div key={wd} className="weekday-label">{wd}</div>
    ));
    return weekdays;
};


const DatePicker = (props) => {    
    const date = new Date(props.year, props.month, 1);
    const cal = new Calendar(date);

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