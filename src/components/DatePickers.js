import DatePicker from './DatePicker';
import React, { useState } from 'react'
import DateSelection from '../utils/DateSelection';
import RGBAColor from '../utils/RGBAColor';

const DatePickers = props => {

    const [activeSelection, setActiveSelection] = useState(
        new DateSelection({
            openingDate: null, 
            color: new RGBAColor({})
        }));

    const [hoverSelection, setHoverSelection] = useState(false);
    const [mouseOverListening, setMouseOverListening] = useState(false);

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
            mouseOverListening={{value: mouseOverListening, set: setMouseOverListening}} />
    )); 

    return(
        <div className='date-picker-list'>
            {datePickers}
        </div>
    )
}

export default DatePickers;