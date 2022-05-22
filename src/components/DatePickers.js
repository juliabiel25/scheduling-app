import DatePicker from './DatePicker';
import React, { useState, useEffect } from 'react'
import DateSelection from '../utils/DateSelection';

const DatePickers = props => {

    const [activeSelection, setActiveSelection] = useState(
        new DateSelection({
            openingDate: null,
            // TODO
            selectionSetIndex: props.focusedSelectionSetIndex 
            // color: props.getSelectionSetColor()
        }));

    const [hoverSelection, setHoverSelection] = useState(false);
    const [mouseOverListening, setMouseOverListening] = useState(false);

    // if the activeSelection has been completed - add the selection to schedule
    useEffect(() => {
        if (activeSelection.complete())
            props.selectionSet.addSelection(activeSelection);
    }, [activeSelection])

    const recordActiveSelection = () => (
        props.addDateSelection(activeSelection)
    )  

    let month = props.dateRange[0].getMonth();
    let year = props.dateRange[0].getFullYear();
    let months = [[month, year]];
    while (month !== props.dateRange[1].getMonth() || year !== props.dateRange[1].getFullYear()) {
        if (month === 11) {
            month = 0;
            year += 1;
        } else {
            month += 1;
        }
        months.push([month, year]);
    }

    let datePickers = months.map(([month, year]) => (
        <DatePicker 
            key={month.toString() + year.toString()}

            month={[month, year]}
            dateRange={props.dateRange}
            recordActiveSelection={recordActiveSelection}
            hoverSelection={{value: hoverSelection, set: setHoverSelection }}
            activeSelection={{value: activeSelection, set: setActiveSelection}}
            mouseOverListening={{value: mouseOverListening, set: setMouseOverListening}}
            selectionSet={props.selectionSet}
            />
    )); 

    return(
        <div className='date-picker-list'>
            {datePickers}
        </div>
    )
}

export default DatePickers;