import { useEffect } from "react";
import DateSelection from "../utils/DateSelection";
import RGBAColor from "../utils/RGBAColor";

const DayTile = props => { 
    let day =  props.day.value;
    const setDay = props.day.set;

    // mark day as hovered or not on hoverSelection change
    useEffect(() => {
        if(props.hoverSelection.value)    
        {
            let newDay = day;
            if (
                day.isEnabled
                && (
                    (
                        day.date <=  props.hoverSelection.value.date 
                        && day.date >= props.activeSelection.value.openingDate
                    )
                    || (
                        day.date >= props.hoverSelection.value.date 
                        && day.date <= props.activeSelection.value.openingDate
                    )
                )
            ){           
                newDay.isHovered = true;              
            }
            else {
                newDay.isHovered = false;                
            }

            setDay(newDay)
        }
    }, [props.hoverSelection.value, day, setDay, props.activeSelection.value, props.hoverSelection])

    // mark day as selected on activeSelection change
    useEffect(() => {
    
        let newDay = day;
        if (
            day.isEnabled
            && (
                (
                    day.date <=  props.activeSelection.value.closingDate 
                    && day.date >= props.activeSelection.value.openingDate
                )
                || (
                    day.date >= props.activeSelection.value.openingDate
                    && day.date <= props.activeSelection.value.closingDate
                )
            )
        ){           
            newDay.isSelected = true;  
            newDay.isHovered = false;            
        }

        setDay(newDay)
    
    }, [props.activeSelection.value, day, setDay])


    function dayTileClicked(e) {        
        // initial or new selection
        if (
            props.activeSelection.value.blank() 
            || props.activeSelection.value.complete()
        ){
            let newSelection = new DateSelection({
                openingDate: day.date, 
                color: props.activeSelection.value.color});

            props.activeSelection.set(newSelection);

            // mark the first tile of the hover selection as hovered immediately
            setDay({...day, isHovered: true});

            // setup the onmouse event listener
            props.mouseOverListening.set(true);
        } 

        // complete the selection if incomplete (and assume that the color is immediately assigned)
        else if (props.activeSelection.value.incomplete()) {
            let prevOpeningDate = props.activeSelection.value.openingDate;
            
            // make sure the selection works both ways (later date to earlier date and the reverse)
            let newSelection = new DateSelection({
                color: props.activeSelection.value.color});

            if (prevOpeningDate > day.date){
                newSelection.openingDate = day.date;
                newSelection.closingDate = prevOpeningDate;
            }
            else {
                newSelection.openingDate = prevOpeningDate;
                newSelection.closingDate = day.date;
            }

            props.activeSelection.set(newSelection);
            props.hoverSelection.set(null);
            
            // setup the onmouse event listener
            props.mouseOverListening.set(false);
        }
    }

    // if tile is hovered --> set hover selection state
    function dayTileHovered(day) {
        props.hoverSelection.set(day);
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
            onMouseOver={ props.activeSelection.value.incomplete() ? () => dayTileHovered(day) : undefined}
            style={ day.isHovered ? 
                    { backgroundColor: new RGBAColor({
                        red: props.activeSelection.value.color.red,
                        green: props.activeSelection.value.color.green,
                        blue: props.activeSelection.value.color.blue,
                        alpha: 0.4
                    })}
                    : 
                    day.isSelected ?  
                    { backgroundColor: props.activeSelection.value.color.toString() }
                    :
                    { backgroundColor: day.colro }}
        >
            { day.date.getDate() }
        </div>
    )      
}

export default DayTile;