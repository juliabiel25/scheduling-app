import { useState, useEffect } from 'react'
import Calendar from '../utils/Calendar';
import DateSelection from '../utils/DateSelection';
import "../styles/DatePicker.css";
import RGBAColor from '../utils/RGBAColor';

const DayTile = props => {
    const day = props.cal.days[props.dayIndex];
    let calCopy = props.cal;
    
    useEffect(() => {
        if(props.hoverSelection)    
        {
            if(
                day.isEnabled
            && ((day.date <=  props.hoverSelection.date && day.date >= props.activeSelection.openingDate)
            || (day.date >= props.hoverSelection.date && day.date <= props.activeSelection.openingDate)))
            {           
                day.isHovered = true;              
            }
            else {
                day.isHovered = false;                
            }

            props.setCal({
                ...props.cal, 
                days: [
                    ...props.cal.days.slice(0, props.dayIndex), 
                    day, 
                    ...props.cal.days.slice(props.dayIndex + 1)
                ]
            })
        }
    }, [props.hoverSelection])

    function dayTileClicked(e) {
        const tile = e.target;
        const date = new Date(props.cal.year, props.cal.month, parseInt(tile.textContent));
        
        // initial or new selection
        if (props.activeSelection.blank() || props.activeSelection.complete()) {
            let sel = new DateSelection({openingDate: date, color: props.selectionColor});
            props.setActiveSelection(sel);

            // setup the onmouse event listener
            props.setMouseOverListening(true);
        } 

        // complete the selection if incomplete (and assume that the color is immediately assigned)
        else if (props.activeSelection.incomplete()) {
            let prevOpeningDate = props.activeSelection.openingDate;
            let sel = new DateSelection({color: props.selectionColor});
            if (prevOpeningDate > date){
                sel.openingDate = date;
                sel.closingDate = prevOpeningDate;
            }
            else {
                sel.openingDate = prevOpeningDate;
                sel.closingDate = date;
            }
            
            let calCopy = props.cal;
            calCopy.clearHover();
            props.setCal(calCopy);
            props.setSelectionSet([...props.selectionSet, sel]);
            props.setActiveSelection(sel);
            
            // setup the onmouse event listener
            props.setMouseOverListening(false);
        }
    }

    // if tile is hovered --> set hover selection state
    function dayTileHovered(e, day) {
        props.setHoverSelection(day);
    }

    return(
        <div  
            key={ `${day.isCurrentMonth.toString()}-${day.date.toString()}` }
            className={
                `day-tile 
                ${day.isEnabled ? 'tile-enabled' : 'tile-disabled'} 
                ${day.isCurrentMonth ? 'current-month-tile' : 'previousMonthTile'}
                ${day.isHovered && !day.color ? 'tile-hovered' : ''}`
            }
            onClick={ day.isEnabled ? dayTileClicked : undefined }
            // onMouseOver={ props.mouseOverListening ? (e) => dayTileHovered(e, day) : undefined}
            onMouseOver={ props.activeSelection.incomplete() ? (e) => dayTileHovered(e, day) : undefined}
            style={ day.isHovered ? 
                    { backgroundColor: new RGBAColor({
                        red: props.selectionColor.red,
                        green: props.selectionColor.green,
                        blue: props.selectionColor.blue,
                        alpha: 0.4
                    })}
                    : 
                    { backgroundColor: day.color }}
        >
            { day.date.getDate() }
        </div>
    )      
}

const DayTiles = (props) => {    
    return(
        props.cal.days.map((day, index) => 
            <DayTile 
                key={day.date}
                dayIndex={index}
                cal={props.cal}
                setCal={props.setCal}
                selectionSet={props.selectionSet}
                selectionColor={props.selectionColor}
                setSelectionSet={props.setSelectionSet}
                hoverSelection={props.hoverSelection}
                setHoverSelection={props.setHoverSelection}
                activeSelection={props.activeSelection}
                setActiveSelection={props.setActiveSelection}
                mouseOverListening={props.mouseOverListening}
                setMouseOverListening={props.setMouseOverListening}
                />
    ))
    
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
        
        // selection inclomplete - assign color to the day opening a new selection
        if (props.activeSelection.incomplete() && cal.includesDate(props.activeSelection.openingDate)) {
            let dayIndex = cal.days.findIndex(it => it.date.getTime() === props.activeSelection.openingDate.getTime())                    
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

        // if selection is complete - assign color to all the days within the selection
        else if (props.activeSelection.complete() && props.activeSelection.includesMonth(props.month, props.year)) {
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
    
    function dayTilesMouseOver(e, rootElementKey) {
        if (e.target.className.includes('tile-enabled')) {
            console.log('selection start:', rootElementKey)
            console.log('selection end:', e.target.key)

        }
    }

    function dayTilesClicked(e) {
        if (e.target.className.includes('tile-enabled') && (props.activeSelection.blank() || props.activeSelection.complete())) {
            console.log('mark as hovered:', e.target.style)
            // change bg color of the initial selection tile
            e.target.style.backgroundColor = props.selectionColor;

            // set the onmouseover on the parent
            console.log(e.target.parentNode)
            e.target.parentNode.onmouseover = (mouseOverEvent) => dayTilesMouseOver(mouseOverEvent, e.target.key)
        }
        else if(props.activeSelection.incomplete()){
            e.target.parentNode.onmouseover = null;
        }
    }

    return (
        <div className="date-picker">
            <div className="month-label">
                {cal.getMonthName()} {cal.year}
            </div>
            <div className="day-tiles">
                <WeekdayLabels cal={cal} />
                <DayTiles 
                    cal={cal} 
                    setCal={setCal}
                    initDate={props.initDate}
                    finalDate={props.finalDate}
                    selectionSet={props.selectionSet} 
                    setSelectionSet={props.setSelectionSet}
                    hoverSelection={props.hoverSelection}
                    setHoverSelection={props.setHoverSelection}
                    activeSelection={props.activeSelection}
                    setActiveSelection={props.setActiveSelection} 
                    selectionColor={props.selectionColor}
                    setMouseOverListening={props.setMouseOverListening}
                    />
            </div>
        </div>
    );
}

export default DatePicker;