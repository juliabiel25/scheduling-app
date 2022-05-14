import DatePicker from './DatePicker'
import TimePicker from './TimePicker'
import React, { useState, useEffect } from 'react'
import "../styles/SchedulePicker.css";
import DateSelection from '../utils/DateSelection';

const Selection = ({selection}) => {
    return (
        <div className='selection'>
            {selection.toString()}
        </div>)

}

const SelectedDates = ({selectionSet}) => {
    return (
        <div className='active-selections'>
            {selectionSet.map((selection, index) => (
                <Selection selection={selection} key={index} />
            ))}
        </div>
        );
}

const SchedulePicker = ({initDate, finalDate}) => {

    const [activeSelection, setActiveSelection] = useState(new DateSelection({openingDate: null}));
    const [selectionSet, setSelectionSet] = useState([]);

    
    
    const generateDatePickers = (initDate, finalDate) => {
        let datePickers = []        

        let month = initDate.getMonth()
        let year = initDate.getFullYear()
        let months = [[month, year]]
        while (month !== finalDate.getMonth() || year !== finalDate.getFullYear()) {
            if (month === 11) {
                month = 0
                year += 1
            } else {
              month += 1  
            }
            months.push([month, year])
        }

        for ([month, year] of months) {
            datePickers.push(
                <DatePicker 
                    key={month.toString() + year.toString()}
                    month={month}
                    year={year}
                    initDate={initDate}
                    finalDate={finalDate} 
                    activeSelection={activeSelection}
                    setActiveSelection={setActiveSelection}
                    selectionSet={selectionSet}
                    setSelectionSet={setSelectionSet}
                />
            )
        }          
        return datePickers;        
    }

    const datePickers = generateDatePickers(initDate, finalDate)   

    return (
        <div className='schedule-picker'>
            
            <div className='date-picker-list'>
                {datePickers}
            </div>

            <SelectedDates selectionSet={selectionSet}/>
                
            {selectionSet[0] !== null &&
                <TimePicker 
                selectionSet={selectionSet}
                setSelectionSet={setSelectionSet} />
            }
        </div>
    );
};

export default SchedulePicker;