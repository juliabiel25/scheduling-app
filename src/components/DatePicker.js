import { range } from '../utils/functions';
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
                    key={ `${day.date.toString()}` }
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
        
    // const previousMonthTiles = props.cal.previousMonthDays.map(day => (
    //     <div 
    //         key={`${props.cal.month - 1}-${day}`} 
    //         className="day-tile tile-disabled">
    //             {day}
    //     </div>
    // ))

    // const currentMonthTiles = props.cal.days.map(day => {
    //     // if the tile is < initDate
    //     if (day.date.getMonth() === props.initDate.getMonth() && day.date.getDate() < props.initDate.getDate()) {
    //         return (
    //             <div  
    //                 key={`${day.date.toString()}`}
    //                 className="day-tile tile-curr-month tile-disabled">
    //                     {day.date.getDate()}
    //             </div>
    //         )
    //     }

    //     // if the tile is < initDate
    //     if (day.date.getMonth() === props.finalDate.getMonth() && day.date.getDate() > props.finalDate.getDate()) {
    //         return (
    //             <div  
    //                 key={`${day.date.toString()}`}
    //                 className="day-tile tile-curr-month tile-disabled">
    //                     {day.date.getDate()}
    //             </div>
    //         )
    //     }

    //     //regular tile
    //     return (
    //         <div  
    //             key={`${day.date.toString()}`}
    //             className="day-tile tile-curr-month tile-enabled" 
    //             onClick={(e)=>(dayTileClicked(e))}>
    //                 {day.date.getDate()}
    //         </div>
    //     )
    // });

    // return [...previousMonthTiles, ...currentMonthTiles];
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