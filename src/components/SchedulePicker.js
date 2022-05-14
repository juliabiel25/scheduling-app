import DatePicker from './DatePicker'
import TimePicker from './TimePicker'
import React, { useState, useEffect } from 'react'
import "../styles/SchedulePicker.css";

const Selection = (props) => {
    return (
        <div className='selection'>
            {props.selection.toString()}
        </div>)

}

const SelectedDates = (props) => {
    return (
        <div className='active-selections'>
            {props.selection.map((selection, index) => (
                <Selection selection={selection} key={index} />
            ))}
        </div>
        );
}

const SchedulePicker = (props) => {

    const [selection, setSelection] = useState([])
    
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
                    selection={selection}
                    setSelection={setSelection}
                />
            )
        }          
        return datePickers;        
    }

    const datePickers = generateDatePickers(props.initDate, props.finalDate)   
    useEffect(() => {
    console.log('selections changed:', selection)
    }, [selection])

    return (
        <div className='schedule-picker'>
            
            <div className='date-picker-list'>
                {datePickers}
            </div>

            <SelectedDates selection={selection}/>
                
            {selection[0] !== null &&
                <TimePicker 
                selection={selection}
                setSelection={setSelection} />
            }
        </div>
    );
};

export default SchedulePicker;